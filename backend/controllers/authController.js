const supabase = require('../config/supabaseClient');

const syncUser = async (req, res) => {
  try {
    const user = req.user; // From verifyToken middleware
    const email = user.email;

    // 1. Check if user already exists in profiles
    const { data: existingProfile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (existingProfile) {
      return res.json({ message: 'Profile already synced', profile: existingProfile });
    }

    // 2. Check if email is in teacher_whitelist
    let role = 'Siswa';
    
    // We assume there's a table 'teacher_whitelist' with column 'email'
    const { data: whitelistData, error: whitelistError } = await supabase
      .from('teacher_whitelist')
      .select('email')
      .eq('email', email)
      .single();

    if (whitelistData) {
      role = 'Guru';
    }

    // 3. Create new profile
    const newProfile = {
      id: user.id,
      email: email,
      role: role,
      username: user.user_metadata?.username || email.split('@')[0],
      full_name: user.user_metadata?.full_name || 'Pengguna Baru',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: insertedProfile, error: insertError } = await supabase
      .from('profiles')
      .insert([newProfile])
      .select()
      .single();

    if (insertError) {
      console.error("Insert Profile Error:", insertError);
      return res.status(500).json({ error: 'Failed to create profile' });
    }

    // 4. Insert into data_siswa or data_guru based on ERD
    if (role === 'Guru') {
      await supabase.from('data_guru').insert([{
        user_id: user.id,
        nama: newProfile.full_name,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }]);
    } else {
      await supabase.from('data_siswa').insert([{
        user_id: user.id,
        nama: newProfile.full_name,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }]);
    }

    res.json({ message: 'Profile created successfully', profile: insertedProfile });
  } catch (error) {
    console.error("Sync User Error:", error);
    res.status(500).json({ error: 'Internal server error during sync' });
  }
};

module.exports = { syncUser };

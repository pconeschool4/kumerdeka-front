const supabase = require('../config/supabaseClient');

const syncUser = async (req, res) => {
  try {
    const user = req.user; // From verifyToken middleware
    const email = user.email;

    // 1. Check if user already exists in users
    const { data: existingProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (existingProfile) {
      return res.json({ message: 'Profile already synced', profile: existingProfile });
    }

    // 2. Check if email is in data_guru
    let role = 'student'; 
    
    const { data: guruData, error: guruError } = await supabase
      .from('data_guru')
      .select('id, email')
      .eq('email', email)
      .maybeSingle();

    if (guruData) {
      role = 'teacher';
    }

    // 3. Create new profile in users
    const newProfile = {
      id: user.id,
      email: email,
      role: role,
      username: user.user_metadata?.username || email.split('@')[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: insertedProfile, error: insertError } = await supabase
      .from('users')
      .insert([newProfile])
      .select()
      .single();

    if (insertError) {
      console.error("Insert Users Error:", insertError);
      return res.status(500).json({ error: 'Failed to create user profile' });
    }

    // 4. Update data_guru or Insert into data_siswa
    const userFullName = user.user_metadata?.full_name || 'Pengguna Baru';

    if (role === 'teacher') {
      // Karena email sudah ada di data_guru, kita tinggal update user_id dan nama-nya
      await supabase.from('data_guru')
        .update({
          user_id: user.id,
          nama: userFullName,
          updated_at: new Date().toISOString()
        })
        .eq('id', guruData.id);
    } else {
      // Jika bukan guru, otomatis jadi siswa
      await supabase.from('data_siswa').insert([{
        user_id: user.id,
        nama: userFullName,
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

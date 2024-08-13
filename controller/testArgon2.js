const argon2 = require('argon2');
const bcrypt = require("bcrypt");

(async () => {
    try {
        // Sử dụng argon2 để mã hóa
        const argon2Hash = await argon2.hash("password");

        // Sử dụng bcrypt để mã hóa
        const salt = await bcrypt.genSalt(10);
        const bcryptHash = await bcrypt.hash("password", salt);

        // In kết quả
        console.log(`Argon2 Hash: ${argon2Hash}`);
        console.log(`Bcrypt Hash: ${bcryptHash}`);

    } catch (err) {
        console.log(err);
    }
})();

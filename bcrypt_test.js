const bcrypt = require("bcryptjs");

async function testHash() {
    try {
        const password = "password123";
        const saltRounds = 10; 
        
        console.log("🔹 Password before hashing:", password);
        console.log("🔹 Salt Rounds:", saltRounds);

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        console.log(" Hashed Password:", hashedPassword);
    } catch (error) {
        console.error(" bcrypt Error:", error);
    }
}

testHash();

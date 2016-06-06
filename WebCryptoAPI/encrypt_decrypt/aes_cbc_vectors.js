
// aes_cbc_vectors.js

// The following function returns an array of test vectors
// for the subtleCrypto encrypt method.
//
// Each test vector has the following fields:
//     name - a unique name for this vector
//     keyBuffer - an arrayBuffer with the key data in raw form
//     key - a CryptoKey object for the keyBuffer. INITIALLY null! You must fill this in first to use it!
//     algorithm - the value of the AlgorithmIdentifier parameter to provide to encrypt
//     plaintext - the text to encrypt
//     result - the expected result (usually just ciphertext, sometimes with added authentication)
function getTestVectors() {
    // Before we can really start, we need to fill a bunch of buffers with data
    var plaintext = new Uint8Array([84, 104, 105, 115, 32, 115,
        112, 101, 99, 105, 102, 105, 99, 97, 116, 105, 111, 110,
        32, 100, 101, 115, 99, 114, 105, 98, 101, 115, 32, 97, 32,
        74, 97, 118, 97, 83, 99, 114, 105, 112, 116, 32, 65, 80,
        73, 32, 102, 111, 114, 32, 112, 101, 114, 102, 111, 114,
        109, 105, 110, 103, 32, 98, 97, 115, 105, 99, 32, 99, 114,
        121, 112, 116, 111, 103, 114, 97, 112, 104, 105, 99, 32,
        111, 112, 101, 114, 97, 116, 105, 111, 110, 115, 32, 105,
        110, 32, 119, 101, 98, 32, 97, 112, 112, 108, 105, 99, 97,
        116, 105, 111, 110, 115, 44, 32, 115, 117, 99, 104, 32, 97,
        115, 32, 104, 97, 115, 104, 105, 110, 103, 44, 32, 115,
        105, 103, 110, 97, 116, 117, 114, 101, 32, 103, 101, 110,
        101, 114, 97, 116, 105, 111, 110, 32, 97, 110, 100, 32,
        118, 101, 114, 105, 102, 105, 99, 97, 116, 105, 111, 110,
        44, 32, 97, 110, 100, 32, 101, 110, 99, 114, 121, 112,
        116, 105, 111, 110, 32, 97, 110, 100, 32, 100, 101, 99,
        114, 121, 112, 116, 105, 111, 110, 46, 32, 65, 100, 100,
        105, 116, 105, 111, 110, 97, 108, 108, 121, 44, 32, 105,
        116, 32, 100, 101, 115, 99, 114, 105, 98, 101, 115, 32, 97,
        110, 32, 65, 80, 73, 32, 102, 111, 114, 32, 97, 112, 112,
        108, 105, 99, 97, 116, 105, 111, 110, 115, 32, 116, 111,
        32, 103, 101, 110, 101, 114, 97, 116, 101, 32, 97, 110,
        100, 47, 111, 114, 32, 109, 97, 110, 97, 103, 101, 32, 116,
        104, 101, 32, 107, 101, 121, 105, 110, 103, 32, 109, 97,
        116, 101, 114, 105, 97, 108, 32, 110, 101, 99, 101, 115,
        115, 97, 114, 121, 32, 116, 111, 32, 112, 101, 114, 102,
        111, 114, 109, 32, 116, 104, 101, 115, 101, 32, 111, 112,
        101, 114, 97, 116, 105, 111, 110, 115, 46, 32, 85, 115,
        101, 115, 32, 102, 111, 114, 32, 116, 104, 105, 115, 32,
        65, 80, 73, 32, 114, 97, 110, 103, 101, 32, 102, 114, 111,
        109, 32, 117, 115, 101, 114, 32, 111, 114, 32, 115, 101,
        114, 118, 105, 99, 101, 32, 97, 117, 116, 104, 101, 110,
        116, 105, 99, 97, 116, 105, 111, 110, 44, 32, 100, 111,
        99, 117, 109, 101, 110, 116, 32, 111, 114, 32, 99, 111,
        100, 101, 32, 115, 105, 103, 110, 105, 110, 103, 44, 32,
        97, 110, 100, 32, 116, 104, 101, 32, 99, 111, 110, 102,
        105, 100, 101, 110, 116, 105, 97, 108, 105, 116, 121, 32,
        97, 110, 100, 32, 105, 110, 116, 101, 103, 114, 105, 116,
        121, 32, 111, 102, 32, 99, 111, 109, 109, 117, 110, 105,
        99, 97, 116, 105, 111, 110, 115, 46]);

    // We want some random key bytes of various sizes.
    // These were randomly generated from a script.
    var keyBytes = {
        128: new Uint8Array([222, 192, 212, 252, 191, 60, 71,
            65, 200, 146, 218, 189, 28, 212, 192, 78]),
        192: new Uint8Array([208, 238, 131, 65, 63, 68, 196, 63, 186, 208,
            61, 207, 166, 18, 99, 152, 29, 109, 221, 95, 240, 30, 28, 246]),
        256: new Uint8Array([103, 105, 56, 35, 251, 29, 88, 7, 63, 145, 236,
            233, 204, 58, 249, 16, 229, 83, 38, 22, 164, 210, 123, 19, 235, 123, 116,
            216, 0, 11, 191, 48])
    }

    // AES-CBC needs a 16 byte (128 bit) IV.
    var iv = new Uint8Array([85, 170, 248, 155, 168, 148, 19, 213, 78, 167, 39,
        167, 108, 39, 162, 132]);


    // Results. These were created using the Python cryptography module.

    // AES-CBC produces ciphertext
    var ciphertext = {
        128: new Uint8Array([35, 127, 3, 254, 231, 8, 114, 231, 143, 174, 193,
            72, 221, 189, 1, 189, 119, 203, 150, 227, 56, 30, 244, 236, 226, 175,
            234, 23, 167, 175, 211, 124, 203, 228, 97, 223, 156, 77, 88, 174,
            166, 187, 186, 225, 176, 92, 250, 177, 225, 41, 135, 124, 215, 86,
            198, 134, 124, 49, 154, 60, 224, 93, 165, 12, 190, 245, 241, 164,
            247, 220, 227, 69, 242, 105, 208, 108, 222, 193, 223, 0, 226, 217,
            39, 160, 78, 147, 191, 38, 153, 232, 206, 221, 254, 25, 185, 249, 7,
            181, 215, 104, 98, 163, 194, 161, 103, 161, 237, 167, 10, 242, 37,
            80, 2, 255, 173, 96, 20, 106, 170, 110, 80, 38, 136, 127, 16, 85,
            244, 78, 172, 56, 106, 3, 115, 130, 58, 186, 129, 236, 255, 251,
            178, 112, 24, 159, 82, 252, 1, 178, 132, 92, 40, 125, 18, 135, 116,
            64, 178, 31, 174, 87, 114, 114, 218, 78, 111, 0, 239, 252, 79, 63,
            119, 58, 118, 78, 55, 249, 36, 130, 225, 205, 13, 76, 97, 214, 250,
            174, 232, 67, 103, 211, 178, 206, 32, 129, 188, 243, 100, 71, 63,
            154, 159, 200, 125, 34, 138, 39, 73, 130, 75, 97, 203, 204, 111,
            244, 75, 186, 181, 43, 207, 175, 146, 98, 207, 27, 23, 90, 144, 161,
            19, 235, 199, 93, 98, 238, 72, 134, 157, 220, 207, 66, 167, 236, 94,
            57, 0, 3, 202, 250, 55, 26, 163, 20, 133, 191, 67, 20, 63, 150, 203,
            87, 216, 44, 57, 188, 236, 64, 80, 111, 68, 26, 12, 10, 163, 82, 3,
            191, 19, 71, 186, 196, 177, 84, 244, 7, 78, 41, 172, 203, 27, 225,
            231, 108, 206, 141, 221, 253, 204, 220, 134, 20, 130, 54, 113, 81,
            127, 197, 27, 101, 121, 159, 223, 193, 115, 190, 12, 153, 174, 231,
            196, 92, 142, 156, 61, 189, 3, 18, 153, 206, 190, 58, 255, 154, 115,
            66, 23, 107, 94, 220, 156, 220, 228, 241, 66, 6, 184, 44, 238, 249,
            51, 240, 109, 142, 208, 189, 11, 117, 70, 170, 217, 170, 216, 66,
            231, 18, 175, 121, 221, 16, 29, 139, 55, 103, 91, 239, 111, 29, 108,
            94, 179, 138, 134, 73, 130, 29, 69, 182, 192, 249, 150, 165, 79, 47,
            91, 203, 226, 63, 87, 52, 60, 172, 191, 190, 179, 171, 155, 205, 88,
            172, 111, 59, 40, 198, 250, 209, 148, 177, 115, 200, 40, 43, 165,
            167, 67, 116, 64, 159, 240, 81, 253, 235, 137, 132, 49, 223, 214,
            172, 53, 7, 47, 184, 223, 120, 59, 51, 33, 124, 147, 221, 27, 60,
            16, 254, 24, 115, 115, 214, 75, 73, 97, 136, 214, 209, 177, 106, 71,
            254, 211, 94, 57, 104, 170, 168, 35, 37, 93, 203, 199, 38, 28, 84]),

        192: new Uint8Array([131, 160, 2, 14, 214, 229, 41, 230, 47, 99, 83,
            193, 62, 133, 172, 195, 127, 61, 247, 80, 71, 167, 37, 184, 230,
            207, 168, 163, 139, 145, 18, 225, 205, 134, 87, 138, 80, 247, 166,
            176, 177, 18, 71, 88, 193, 56, 45, 96, 36, 78, 134, 212, 9, 250, 217,
            24, 207, 215, 111, 72, 114, 203, 27, 188, 122, 34, 212, 191, 88, 72,
            22, 194, 224, 217, 236, 201, 191, 236, 214, 231, 90, 244, 100, 153,
            211, 35, 182, 205, 128, 84, 79, 161, 53, 166, 236, 196, 181, 163,
            140, 255, 80, 59, 49, 71, 170, 118, 14, 100, 40, 105, 184, 187, 41,
            198, 180, 135, 69, 211, 69, 74, 132, 243, 76, 144, 102, 90, 155,
            243, 125, 140, 190, 20, 9, 232, 188, 198, 221, 148, 13, 53, 155, 91,
            34, 235, 24, 121, 109, 48, 242, 142, 8, 160, 223, 242, 163, 98, 198,
            131, 164, 160, 79, 27, 210, 216, 192, 228, 27, 4, 254, 222, 195, 14,
            77, 72, 225, 151, 114, 38, 130, 143, 6, 17, 138, 229, 193, 114, 169,
            2, 108, 225, 35, 37, 232, 200, 167, 147, 251, 210, 138, 243, 44, 48,
            12, 84, 192, 169, 108, 0, 113, 77, 160, 218, 96, 4, 138, 171, 207,
            20, 189, 146, 255, 206, 68, 160, 87, 127, 3, 83, 182, 203, 116, 59,
            24, 186, 79, 68, 220, 161, 85, 227, 29, 118, 134, 128, 187, 29, 128,
            121, 120, 64, 211, 30, 255, 52, 187, 185, 216, 151, 30, 10, 165,
            203, 148, 39, 224, 14, 173, 199, 57, 0, 194, 79, 115, 206, 159, 43,
            13, 36, 169, 97, 144, 32, 0, 207, 230, 16, 162, 156, 166, 34, 150,
            12, 93, 141, 164, 181, 194, 10, 47, 139, 82, 75, 42, 23, 224, 3, 92,
            151, 154, 249, 170, 57, 141, 113, 32, 52, 158, 218, 49, 242, 134,
            65, 69, 203, 71, 19, 133, 125, 117, 1, 207, 210, 224, 130, 45, 37,
            42, 181, 139, 34, 85, 8, 67, 165, 249, 180, 89, 3, 60, 152, 1, 231,
            49, 1, 124, 243, 81, 44, 72, 232, 239, 129, 75, 108, 4, 169, 132,
            73, 183, 21, 29, 46, 94, 138, 83, 190, 131, 146, 65, 104, 107, 251,
            218, 95, 227, 94, 145, 70, 0, 2, 252, 59, 188, 58, 150, 203, 148,
            100, 219, 36, 182, 81, 237, 138, 160, 83, 151, 119, 11, 216, 122,
            134, 189, 246, 251, 192, 41, 158, 125, 247, 190, 32, 173, 104, 9,
            58, 223, 97, 212, 48, 62, 3, 112, 21, 74, 206, 87, 182, 110, 197,
            67, 68, 155, 189, 223, 136, 2, 239, 137, 151, 138, 252, 162, 141,
            255, 209, 25, 4, 146, 24, 221, 43, 148, 120, 26, 228, 208, 200, 198,
            192, 4, 96, 70, 227, 237, 104, 17, 67, 9, 211]),

        256: new Uint8Array([41, 213, 121, 140, 181, 227, 200, 97, 100, 133, 58,
            227, 106, 115, 25, 63, 77, 51, 26, 57, 238, 140, 99, 63, 71, 211,
            128, 84, 115, 26, 236, 52, 103, 81, 145, 14, 101, 161, 181, 58, 135,
            193, 56, 167, 214, 220, 5, 52, 85, 222, 183, 27, 101, 134, 86, 155,
            64, 148, 124, 212, 219, 251, 65, 42, 32, 44, 128, 2, 50, 128, 221,
            22, 238, 56, 189, 83, 28, 122, 121, 157, 215, 135, 151, 128, 233,
            193, 65, 190, 86, 148, 191, 140, 196, 120, 8, 172, 100, 166, 254,
            41, 245, 75, 56, 6, 166, 244, 178, 111, 234, 23, 4, 107, 6, 22, 132,
            187, 230, 17, 71, 172, 113, 238, 73, 4, 180, 90, 103, 77, 37, 51,
            118, 112, 129, 238, 199, 7, 222, 122, 173, 30, 232, 178, 233, 234,
            144, 98, 14, 234, 112, 77, 68, 62, 62, 159, 230, 101, 98, 43, 2,
            204, 69, 156, 86, 104, 128, 34, 128, 7, 173, 90, 120, 33, 104, 59,
            45, 251, 93, 51, 240, 232, 60, 94, 189, 134, 90, 20, 184, 122, 29,
            225, 85, 213, 38, 116, 159, 80, 69, 106, 168, 236, 201, 69, 140, 98,
            240, 45, 160, 133, 225, 106, 45, 245, 212, 160, 176, 128, 27, 114,
            153, 182, 144, 145, 214, 72, 196, 138, 183, 87, 61, 245, 150, 56,
            82, 158, 224, 50, 114, 125, 122, 172, 161, 129, 234, 70, 63, 245,
            136, 30, 136, 9, 128, 220, 229, 157, 222, 195, 149, 189, 70, 8, 71,
            40, 195, 93, 27, 7, 234, 164, 175, 102, 201, 149, 115, 248, 179,
            125, 66, 122, 194, 26, 61, 218, 198, 181, 152, 140, 199, 48, 148,
            31, 14, 241, 197, 3, 70, 128, 239, 32, 86, 15, 215, 86, 245, 190,
            95, 141, 41, 111, 0, 232, 28, 152, 67, 87, 197, 255, 118, 13, 251,
            71, 84, 22, 231, 134, 188, 175, 115, 138, 37, 199, 5, 238, 199, 2,
            99, 203, 75, 62, 231, 21, 150, 239, 94, 201, 185, 219, 58, 210, 228,
            151, 131, 76, 148, 104, 60, 74, 82, 6, 168, 49, 251, 182, 3, 232,
            173, 210, 201, 19, 101, 166, 7, 94, 11, 194, 211, 146, 229, 75, 241,
            15, 50, 187, 36, 175, 78, 227, 98, 224, 3, 95, 209, 93, 126, 112,
            178, 29, 18, 108, 241, 232, 79, 210, 41, 2, 238, 208, 190, 171, 134,
            147, 188, 191, 229, 122, 32, 209, 166, 118, 129, 223, 130, 214, 195,
            89, 67, 94, 218, 155, 185, 0, 144, 255, 132, 213, 25, 59, 83, 242,
            57, 69, 148, 109, 133, 61, 163, 30, 214, 254, 54, 169, 3, 217, 77,
            66, 123, 193, 204, 199, 109, 123, 49, 186, 223, 229, 8, 230, 164,
            171, 196, 145, 225, 10, 111, 248, 111, 164, 216, 54, 225, 253])
    };

    // Replace the last block of each ciphertext with bad padding below for decryption errors
    var badPadding = {
        128: {
            "zeroPadChar": new Uint8Array([238, 27, 248, 169, 218, 138, 164, 86, 207, 102, 36, 223, 6, 166, 77, 14]),
            "bigPadChar": new Uint8Array([91, 67, 119, 104, 252, 238, 175, 144, 17, 75, 12, 163, 212, 52, 46, 51]),
            "inconsistentPadChars": new Uint8Array([135, 101, 112, 208, 3, 106, 226, 20, 25, 219, 79, 94, 58, 212, 242, 192])
        },
        192: {
            "zeroPadChar": new Uint8Array([22, 158, 50, 15, 168, 47, 19, 194, 182, 133, 184, 65, 36, 43, 177, 254]),
            "bigPadChar": new Uint8Array([207, 110, 28, 160, 165, 213, 48, 213, 163, 242, 15, 78, 96, 117, 106, 87]),
            "inconsistentPadChars": new Uint8Array([143, 227, 12, 112, 216, 207, 136, 167, 78, 137, 93, 30, 50, 75, 102, 101])
        },
        256: {
            "zeroPadChar": new Uint8Array([1, 253, 141, 214, 30, 193, 254, 68, 140, 200, 157, 110, 200, 89, 177, 129]),
            "bigPadChar": new Uint8Array([88, 7, 110, 221, 74, 34, 97, 109, 99, 25, 189, 222, 94, 90, 27, 60]),
            "inconsistentPadChars": new Uint8Array([152, 54, 60, 148, 59, 136, 193, 21, 77, 140, 170, 67, 120, 74, 106, 62])
        }
    };

    var keyLengths = [128, 192, 256];

    // All the scenarios that should succeed, if the key has "encrypt" usage
    var passing = [];
    keyLengths.forEach(function(keyLength) {
        passing.push({
            name: "AES-CBC " + keyLength.toString() + "-bit key",
            keyBuffer: keyBytes[keyLength],
            key: null,
            algorithm: {name: "AES-CBC", iv: iv},
            plaintext: plaintext,
            result: ciphertext[keyLength]
        });
    });

    // Scenarios that should fail because of a bad iv length, causing an OperationError
    var failing = [];
    keyLengths.forEach(function(keyLength) {
        var shortIv = iv.slice(0, 8);
        failing.push({
            name: "AES-CBC " + keyLength.toString() + "-bit key, 64-bit IV",
            keyBuffer: keyBytes[keyLength],
            key: null,
            algorithm: {name: "AES-CBC", iv: shortIv},
            plaintext: plaintext
        });

        var longIv = new Uint8Array(24);
        longIv.set(iv, 0);
        longIv.set(iv.slice(0, 8), 16);
        failing.push({
            name: "AES-CBC " + keyLength.toString() + "-bit key, 192-bit IV",
            keyBuffer: keyBytes[keyLength],
            key: null,
            algorithm: {name: "AES-CBC", iv: longIv},
            plaintext: plaintext
        });
    });

    // Scenarios that should fail decryption because of bad padding
    var decryptionFailing = [];
    keyLengths.forEach(function(keyLength) {
        ["zeroPadChar", "bigPadChar", "inconsistentPadChars"].forEach(function(paddingProblem) {
            var badCiphertext = new Uint8Array(ciphertext[keyLength].byteLength);
            badCiphertext.set(ciphertext[keyLength].slice(0, ciphertext[keyLength].byteLength - 16));
            badCiphertext.set(badPadding[keyLength][paddingProblem]);

            decryptionFailing.push({
                name: "AES-CBC " + keyLength.toString() + "-bit key, " + paddingProblem,
                keyBuffer: keyBytes[keyLength],
                key: null,
                algorithm: {name: "AES-CBC", iv: iv},
                plaintext: plaintext,
                result: badCiphertext
            });
        });
    });

    return {passing: passing, failing: failing, decryptionFailing: decryptionFailing};
}

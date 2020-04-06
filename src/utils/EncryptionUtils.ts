import bcrypt from 'bcrypt';

export class EncryptionUtils {

    static getEncryptedValue(plainText: string): string {

        return bcrypt.hashSync(plainText, 10);
    }

    static comparePlainTextWithEncryptedValue(plainText: string, encryptedText: string): boolean {

        return bcrypt.compareSync(plainText, encryptedText);
    }
}
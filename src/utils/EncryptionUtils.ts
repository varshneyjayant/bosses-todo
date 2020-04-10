import bcrypt from 'bcrypt';

export class EncryptionUtils {

    static async getEncryptedValue(plainText: string): Promise<string> {

        return await bcrypt.hash(plainText, 10);
    }

    static async comparePlainTextWithEncryptedValue(plainText: string, encryptedText: string): Promise<boolean> {

        return await bcrypt.compare(plainText, encryptedText);
    }
}
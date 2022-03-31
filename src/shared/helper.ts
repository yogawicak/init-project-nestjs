import * as bcrypt from 'bcrypt';

export class HelperFunction {
  static async PasswordEncrypt(password: string) {
    return await bcrypt.hash(password, 12);
  }

  static async PasswordDecrypt(password: string, hashPassword: string) {
    return await bcrypt.compare(password, hashPassword);
  }

  static GenerateFourDigitNumber() {
    return Math.floor(1000 + Math.random() * 9000);
  }

  // static async mappingArray(data: []) {
  //   return new Promise((resolve, reject) => {

  //   });
  // }
  //   static async UploadFileMini
}

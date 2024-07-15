import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as sharp from 'sharp';
@Injectable()
export class FileService {
  constructor() {}

  uploadImages(files: Express.Multer.File[]) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.verifyFileExtension(files);
        const fileNames = await this.sharpToWebp(files);
        resolve(fileNames);
      } catch (err) {
        reject(err);
      }
    });
  }

  verifyFileExtension(files: Express.Multer.File[]) {
    return new Promise<void>((resolve, reject) => {
      if (files.length == 0) {
        reject(new HttpException('No files found', HttpStatus.BAD_REQUEST));
      }

      for (let i = 0; i < Array(files).length; i++) {
        if (
          !(
            files[i].mimetype === 'image/jpeg' ||
            files[i].mimetype === 'image/png' ||
            files[i].mimetype === 'image/jpg'
          )
        ) {
          reject(
            new HttpException(
              'Only images of types image/jpeg, image/png, or image/jpg are allowed',
              HttpStatus.BAD_REQUEST,
            ),
          );
        }
      }
      resolve();
    });
  }

  writeFilesToDisk(files: Express.Multer.File[]) {
    return new Promise((resolve, reject) => {
      const fileNames: string[] = [];
      files.forEach((file) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const filename = uniqueSuffix + '-' + file.originalname;
        fileNames.push(filename);
        const filePath = path.join(
          './uploads',
          uniqueSuffix + '-' + file.originalname,
        );
        fs.writeFile(filePath, file.buffer, (err) => {
          if (err) {
            reject(
              new HttpException(
                'Error saving images:' + err.message,
                HttpStatus.BAD_REQUEST,
              ),
            );
          }
          console.log('File saved successfully');
          resolve(fileNames);
        });
      });
    });
  }

  sharpToWebp(files: Express.Multer.File[]) {
    return new Promise(async (resolve, reject) => {
      const fileNames: string[] = [];
      try {
        for (const file of files) {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const metadata = sharp(file.buffer).metadata();

          const filename =
            slugify(path.parse(uniqueSuffix + '-' + file.originalname).name) +
            '.webp';
          await sharp(file.buffer)
            .withMetadata()
            .rotate()
            .resize()
            .webp()
            .toFile('uploads/' + filename);
          fileNames.push(filename);
        }
      } catch {
        reject(
          new HttpException('Error saving images', HttpStatus.BAD_REQUEST),
        );
      } finally {
        resolve(fileNames);
      }
    });
  }

  DeleteFilesFromDisk(files: string[]) {
    return new Promise<void>((resolve, reject) => {
      try {
        files.forEach((file) => {
          fs.unlinkSync('uploads/' + file);
        });
        resolve();
      } catch (err) {
        reject(
          new HttpException(
            'Error deleting images: file Not found',
            HttpStatus.BAD_REQUEST,
          ),
        );
      }
    });
  }
}

function slugify(str: string) {
  return String(str)
    .normalize('NFKD') // split accented characters into their base characters and diacritical marks
    .replace(/[\u0300-\u036f]/g, '') // remove all the accents, which happen to be all in the \u03xx UNICODE block.
    .trim() // trim leading or trailing whitespace
    .toLowerCase() // convert to lowercase
    .replace(/[^a-z0-9 -]/g, '') // remove non-alphanumeric characters
    .replace(/\s+/g, '-') // replace spaces with hyphens
    .replace(/-+/g, '-'); // remove consecutive hyphens
}

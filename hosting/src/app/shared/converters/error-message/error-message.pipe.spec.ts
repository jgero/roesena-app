import { ErrorMessagePipe } from './error-message.pipe';
import { FormControl } from '@angular/forms';

describe('ErrorMessagePipe', () => {
  it('create an instance', () => {
    const pipe = new ErrorMessagePipe();
    expect(pipe).toBeTruthy();
  });

  describe('should create a message on invalid', () => {
    it('email', () => {
      const pipe = new ErrorMessagePipe();
      const a = new FormControl();
      a.setErrors({ email: true });
      expect(pipe.transform(a)).toBeTruthy();
    });
    it('min-length', () => {
      const pipe = new ErrorMessagePipe();
      const a = new FormControl();
      a.setErrors({ minlength: true });
      expect(pipe.transform(a)).toBeTruthy();
    });
    it('pattern', () => {
      const pipe = new ErrorMessagePipe();
      const a = new FormControl();
      a.setErrors({ pattern: true });
      expect(pipe.transform(a)).toBeTruthy();
    });
    it('required', () => {
      const pipe = new ErrorMessagePipe();
      const a = new FormControl();
      a.setErrors({ required: true });
      expect(pipe.transform(a)).toBeTruthy();
    });
    it('maxlength', () => {
      const pipe = new ErrorMessagePipe();
      const a = new FormControl();
      a.setErrors({ maxlength: true });
      expect(pipe.transform(a)).toBeTruthy();
    });
    it('matDatepickerParse', () => {
      const pipe = new ErrorMessagePipe();
      const a = new FormControl();
      a.setErrors({ matDatepickerParse: true });
      expect(pipe.transform(a)).toBeTruthy();
    });
    it('dateAndTime', () => {
      const pipe = new ErrorMessagePipe();
      const a = new FormControl();
      a.setErrors({ dateAndTime: true });
      expect(pipe.transform(a)).toBeTruthy();
    });
    it('mustContainSelf', () => {
      const pipe = new ErrorMessagePipe();
      const a = new FormControl();
      a.setErrors({ mustContainSelf: true });
      expect(pipe.transform(a)).toBeTruthy();
    });
    it('participantsMissing', () => {
      const pipe = new ErrorMessagePipe();
      const a = new FormControl();
      a.setErrors({ participantsMissing: true });
      expect(pipe.transform(a)).toBeTruthy();
    });
  });

  it('should not return message if there is no error', () => {
    const pipe = new ErrorMessagePipe();
    const a = new FormControl();
    expect(pipe.transform(a)).toBeFalsy();
  });

  it('should throw error when no message is implemented for provided error', () => {
    const pipe = new ErrorMessagePipe();
    const a = new FormControl();
    a.setErrors({ asdfasdfasdf: true });
    expect(() => pipe.transform(a)).toThrowError();
  });
});

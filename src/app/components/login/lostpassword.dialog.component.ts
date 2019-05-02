
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  templateUrl: 'lostpassword.dialog.component.html',
})
export class LostPasswordDialogComponent implements OnInit {

  resetPasswordEmailSent = false;
  errorMessage: string;
  loginForm: FormGroup;

  constructor(private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) private data: { email: string }) { }
  ngOnInit(): void {
    this.loginForm = new FormGroup({
      'email': new FormControl(this.data.email, [Validators.required, Validators.email])
    });
  }

  sendResetPwdEmail() {
    const email = this.loginForm.get('email').value;
    this.errorMessage = '';
    this.resetPasswordEmailSent = false;
    this.authService.sendResetPasswordEmail(email)
      .then(() => this.resetPasswordEmailSent = true)
      .catch(error => {
        console.error(`LostPasswordDialogComponent: ${error}`);
        this.errorMessage = this.authService.handleAuthError(error);
      });
  }
}
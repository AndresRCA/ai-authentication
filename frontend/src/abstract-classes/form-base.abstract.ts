import { FormGroup } from "@angular/forms";

export abstract class AbstractFormBase {
  public form!: FormGroup;
  
  /**
   * When the user tries to submit the form, shows the alerts indicating what control is missing requirements all at once
   */
  protected displayValidationErrors(): void {
    // set controls as dirty here so the html can show the validation messages
    Object.keys(this.form.controls).forEach((controlName) => {
      const control = this.form.controls[controlName];
      control.markAsDirty();
    });
  }
}
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'tag-input',
  templateUrl: './tag-input.component.html',
  styleUrls: ['./tag-input.component.scss']
})
export class TagInputComponent implements OnInit {
  public stringTag: FormControl;
  public regexOptions: string[];
  public travelOption: boolean;
  @Input() public tags: string[];
  @Input() private optionalTags: string[];
  @Output() private tagsChange: EventEmitter<string[]>;
  @ViewChild('tagInput') tagInput!: ElementRef<HTMLInputElement>;

  constructor() {
    this.stringTag = new FormControl('', [Validators.required])
    this.regexOptions = new Array<string>();
    this.travelOption = false;
    this.tags = new Array<string>();
    this.optionalTags = new Array<string>();
    this.tagsChange = new EventEmitter<string[]>();
  }

  ngOnInit() {
    this.stringTag.valueChanges.subscribe((value: string) => {
      const lastChar = value.substring(value.length - 1);
      if (lastChar === ',') {
        const tagName = value.replace(',', '').toLowerCase().trim();

        if (this.checkDuplication(tagName) || tagName === '' || tagName.includes(',')) {
          this.stringTag.setValue(tagName)
          return;
        }

        if (this.optionalTags.length > 0 && !this.optionalTags.includes(tagName)) {
          this.stringTag.setValue(tagName)
          return;
        }

        this.tags.push(tagName);
        this.stringTag.reset('');
        this.tagsChange.emit(this.tags);
      }

      if (this.stringTag.valid)
        this.regexOptions = this.optionalTags.filter(tag => new RegExp(value, 'i').test(tag) && !this.checkDuplication(tag));
      else this.regexOptions = new Array<string>();
    });
  }

  optionClick(option: string): void {
    this.stringTag.reset('');
    this.tags.push(option)
    this.regexOptions = new Array<string>();
    this.tagsChange.emit(this.tags);
    this.tagInput.nativeElement.focus();
  }

  /**
   * Checks for duplicate items in the tag list
   */
  private checkDuplication(tag: string): boolean {
    return this.tags.indexOf(tag) > -1 ? true : false;
  }

  /**
   * If the user uses Delete or Backspace on an empty form
   * field, set the value to the last tag
   */
  checkBackspaceOnEmpty({ key }: KeyboardEvent): void {
    if (this.tags.length > 0 && (key === 'Enter' || key === 'Backspace') && !this.stringTag.valid) {
      const lastVal = this.tags.pop();
      this.stringTag.setValue(lastVal + ' ');
      this.tagsChange.emit(this.tags);
    }
  }

  /**
   * If element gets blur will reset the  regex Options
   */
  blurTag(): void {
    if (!this.travelOption) setTimeout(() => {
      this.regexOptions = new Array<string>();
    }, 200);
  }

  /**
   * Removes the tag from the array if clicked on
   */
  removeTag(index: number): void {
    this.tags.splice(index, 1);
    this.tagsChange.emit(this.tags);
  }

  optionsFocus({ firstChild }: HTMLSpanElement): void {
    if (this.regexOptions.length > 0) {
      this.travelOption = true;
      (firstChild as HTMLButtonElement).focus();
    }
  }

  nextFocus({ target, key }: KeyboardEvent, index: number): void {
    if (key === 'ArrowDown' && index !== this.regexOptions.length - 1) {
      ((target as Element).nextSibling as HTMLButtonElement).focus();
    } else if (key === 'ArrowUp' && index !== 0) {
      ((target as Element).previousSibling as HTMLButtonElement).focus();
    } else if (key === 'ArrowUp' && index === 0) {
      this.tagInput.nativeElement.focus();
    } else if (key === 'Escape') {
      this.regexOptions = new Array<string>();
    }
  }

  exists(tag: string): boolean {
    return !!this.optionalTags.length && !this.optionalTags.some(option => option === tag);
  }
}

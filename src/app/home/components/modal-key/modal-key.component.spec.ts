import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalKeyComponent } from './modal-key.component';

describe('ModalKeyComponent', () => {
  let component: ModalKeyComponent;
  let fixture: ComponentFixture<ModalKeyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalKeyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalKeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

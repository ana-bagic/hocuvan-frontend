import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupFavsComponent } from './signup-favs.component';

describe('SignupFavsComponent', () => {
  let component: SignupFavsComponent;
  let fixture: ComponentFixture<SignupFavsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignupFavsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupFavsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

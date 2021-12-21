import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnsuccessComponent } from './unsuccess.component';

describe('UnsuccessComponent', () => {
  let component: UnsuccessComponent;
  let fixture: ComponentFixture<UnsuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnsuccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnsuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

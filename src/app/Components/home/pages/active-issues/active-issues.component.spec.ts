import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveIssuesComponent } from './active-issues.component';

describe('ActiveIssuesComponent', () => {
  let component: ActiveIssuesComponent;
  let fixture: ComponentFixture<ActiveIssuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActiveIssuesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActiveIssuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixingTeamsComponent } from './fixing-teams.component';

describe('FixingTeamsComponent', () => {
  let component: FixingTeamsComponent;
  let fixture: ComponentFixture<FixingTeamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FixingTeamsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FixingTeamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

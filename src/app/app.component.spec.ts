import {TestBed, ComponentFixture, inject} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {StartupService} from '../services/startup.service';
import {TabsPage} from '../pages/tabs/tabs';

import {NevillsApp} from './app.component';

describe('NevillsApp', () => {
  let fixture: ComponentFixture<NevillsApp>;
  let instance: NevillsApp;

  const startupMock = {
    init: (): void => undefined
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [
        NO_ERRORS_SCHEMA
      ],
      declarations: [
        NevillsApp
      ],
      providers: [
        {provide: StartupService, useValue: startupMock},
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NevillsApp);
    instance = fixture.debugElement.componentInstance;
  });

  it('should create the root page', () => {
    expect(instance).toBeTruthy();
  });

  it('should set root page component', () => {
    expect(instance.rootPage).toEqual(TabsPage);
  });

});

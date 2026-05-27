import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuiaUsuario } from './guia-usuario';

describe('GuiaUsuario', () => {
  let component: GuiaUsuario;
  let fixture: ComponentFixture<GuiaUsuario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuiaUsuario]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuiaUsuario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

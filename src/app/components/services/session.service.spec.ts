import { TestBed } from '@angular/core/testing';
import { SessionService } from './session.service';

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(() => {

    localStorage.clear();
    
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionService);

    // Limpiar localStorage antes de cada prueba
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should set the user as logged in and store user in localStorage', () => {
      const user = { id: 1, name: 'Test User' };
      service.login(user);

      expect(service.getSessionStatus()).toBeTrue();
      expect(service.getLoggedInUser()).toEqual(user);
      expect(localStorage.getItem('loggedInUser')).toEqual(JSON.stringify(user));
    });
  });

  describe('logout', () => {
    it('should clear the user session and remove user from localStorage', () => {
      const user = { id: 1, name: 'Test User' };
      service.login(user);
      service.logout();

      expect(service.getSessionStatus()).toBeFalse();
      expect(service.getLoggedInUser()).toBeNull();
      expect(localStorage.getItem('loggedInUser')).toBeNull();
    });
  });

  describe('getSessionStatus', () => {
    it('should return true if the user is logged in', () => {
      const user = { id: 1, name: 'Test User' };
      service.login(user);

      expect(service.getSessionStatus()).toBeTrue();
    });

    it('should return false if the user is not logged in', () => {
      expect(service.getSessionStatus()).toBeFalse();
    });
  });

  describe('getLoggedInUser', () => {
    it('should return the logged-in user if logged in', () => {
      const user = { id: 1, name: 'Test User' };
      service.login(user);

      expect(service.getLoggedInUser()).toEqual(user);
    });

    it('should return null if no user is logged in', () => {
      expect(service.getLoggedInUser()).toBeNull();
    });
  });

  describe('initialization', () => {
    it('should load the logged-in user from localStorage if it exists', () => {
      const user = { id: 1, name: 'Stored User' };
      localStorage.setItem('loggedInUser', JSON.stringify(user));

      // Crear una nueva instancia del servicio
      const newService = new SessionService();

      expect(newService.getSessionStatus()).toBeTrue();
      expect(newService.getLoggedInUser()).toEqual(user);
    });

    it('should not mark as logged in if no user exists in localStorage', () => {
      // Crear una nueva instancia del servicio
      const newService = new SessionService();

      expect(newService.getSessionStatus()).toBeFalse();
      expect(newService.getLoggedInUser()).toBeNull();
    });
  });
});
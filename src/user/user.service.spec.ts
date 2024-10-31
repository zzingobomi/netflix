import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import e from 'express';
import { NotFoundException } from '@nestjs/common';

const mockUserRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('UserService', () => {
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [{ id: 1, email: 'zzingo@naver.com' }];
      mockUserRepository.find.mockResolvedValue(users);

      const result = await userService.findAll();

      expect(result).toEqual(users);
      expect(mockUserRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const user = { id: 1, email: 'zzingo@naver.com' };

      jest.spyOn(mockUserRepository, 'findOne').mockResolvedValue(user);

      const result = await userService.findOne(1);

      expect(result).toEqual(user);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw a NotFoundException if user is not found', async () => {
      jest.spyOn(mockUserRepository, 'findOne').mockResolvedValue(null);

      expect(userService.findOne(999)).rejects.toThrow();
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
      });
    });
  });

  describe('remove', () => {
    it('should delete a user by id', async () => {
      const id = 999;

      jest.spyOn(mockUserRepository, 'findOne').mockResolvedValue({
        id: 1,
      });

      const result = await userService.remove(id);

      expect(result).toEqual(id);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id },
      });
    });

    it('should throw a NotFoundException if user to delete is not found', async () => {
      jest.spyOn(mockUserRepository, 'findOne').mockResolvedValue(null);

      expect(userService.remove(999)).rejects.toThrow(NotFoundException);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
      });
    });
  });
});

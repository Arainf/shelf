import { Test, TestingModule } from '@nestjs/testing';
import {AuthService} from "./auth.service.js";
import {UnauthorizedException} from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import { Role } from "@shelf/shared";
import { describe, expect, it, vi} from "vitest";


describe('AuthController.login', () => {
  const hash = bcrypt.hashSync('correct-horse', 4);
  const user = {
    id: 'u1', username : 'rain', fullName: 'R', role: Role.ADMIN,
    isActive: true, tokenVersion: 0, passwordHash: hash, createdAt: new Date(),
  };

  const users = { findByUsername: vi.fn() };
  const jwt = { signAsync: vi.fn().mockResolvedValue('token')};
  const service = new AuthService(users as any, jwt as any);

  it('return the same error for unknown user and wrong password', async () => {
    users.findByUsername.mockResolvedValue(null);
    const a = await service.login('ghost', 'x').catch((e) => e);
    users.findByUsername.mockResolvedValue(user);
    const b = await service.login('rain', 'wrong').catch((e) => e);
    expect(a).toBeInstanceOf(UnauthorizedException);
    expect(a.message).toBe(b.message);
  });

  it('rejects deactivated users event with the right password', async () => {
    users.findByUsername.mockResolvedValueOnce({ ...user, isActive: false});
    await expect(service.login('rain', 'correct-horse')).rejects.toBeInstanceOf(UnauthorizedException)
  })

});

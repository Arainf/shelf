import { Test } from '@nestjs/testing';
import { HealthController } from "../src/health.controller.js";
import { DataSource } from "typeorm";
import { describe, it, expect, vi } from 'vitest'

describe('HealthController', () => {
    it('should return status ok when db is reachable', async () => {
        const mockDataSource = {
            query: vi.fn().mockResolvedValue([{ 1: 1}]),
        };

        const moduleRef = await Test.createTestingModule({
            controllers: [HealthController],
            providers: [{ provide: DataSource, useValue: mockDataSource }],
        }).compile();

        const controller = moduleRef.get<HealthController>(HealthController);
        const result = await controller.check();

        expect(result.status).toBe('ok');
        expect(result.database).toBe('connected');
    });
});
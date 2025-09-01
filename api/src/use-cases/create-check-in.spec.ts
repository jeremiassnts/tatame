import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryCheckInRepository } from '../../test/repositories/in-memory-check-in.repository';
import { CreateCheckInUseCase } from './create-check-in';
import { CheckIn } from '../entities/check-in';

describe('Create Check-in Use Case', () => {
  let sut: CreateCheckInUseCase;
  let checkInRepository: InMemoryCheckInRepository;

  beforeEach(() => {
    checkInRepository = new InMemoryCheckInRepository();
    sut = new CreateCheckInUseCase(checkInRepository);
  });

  it('should create a check-in', async () => {
    const referenceDate = new Date('2024-01-15');

    const result = await sut.execute({
      classId: 'class-1',
      userId: 'user-1',
      referenceDate,
    });

    expect(result.checkIn.id).toEqual(expect.any(String));
    expect(result.checkIn.classId).toEqual('class-1');
    expect(result.checkIn.userId).toEqual('user-1');
    expect(result.checkIn.referenceDate).toEqual(referenceDate);
    expect(checkInRepository.checkIns).toHaveLength(1);
  });

  it('should not allow duplicate check-in for the same user, class and date', async () => {
    const referenceDate = new Date('2024-01-15');

    // Create first check-in
    const existingCheckIn = new CheckIn({
      classId: 'class-1',
      userId: 'user-1',
      createdAt: new Date(),
      referenceDate,
    });

    await checkInRepository.create(existingCheckIn);

    // Try to create duplicate check-in for the same date
    await expect(
      sut.execute({
        classId: 'class-1',
        userId: 'user-1',
        referenceDate,
      }),
    ).rejects.toThrow('User is already checked in for this class on this date');
  });

  it('should allow check-in for different classes', async () => {
    const referenceDate = new Date('2024-01-15');

    // Create first check-in
    await sut.execute({
      classId: 'class-1',
      userId: 'user-1',
      referenceDate,
    });

    // Create check-in for different class
    const result = await sut.execute({
      classId: 'class-2',
      userId: 'user-1',
      referenceDate,
    });

    expect(result.checkIn.classId).toEqual('class-2');
    expect(checkInRepository.checkIns).toHaveLength(2);
  });

  it('should allow check-in for different users in the same class', async () => {
    const referenceDate = new Date('2024-01-15');

    // Create first check-in
    await sut.execute({
      classId: 'class-1',
      userId: 'user-1',
      referenceDate,
    });

    // Create check-in for different user
    const result = await sut.execute({
      classId: 'class-1',
      userId: 'user-2',
      referenceDate,
    });

    expect(result.checkIn.userId).toEqual('user-2');
    expect(checkInRepository.checkIns).toHaveLength(2);
  });

  it('should allow check-in for the same user and class on different dates', async () => {
    const referenceDate1 = new Date('2024-01-15');
    const referenceDate2 = new Date('2024-01-16');

    // Create first check-in
    await sut.execute({
      classId: 'class-1',
      userId: 'user-1',
      referenceDate: referenceDate1,
    });

    // Create check-in for the same class and user but different date
    const result = await sut.execute({
      classId: 'class-1',
      userId: 'user-1',
      referenceDate: referenceDate2,
    });

    expect(result.checkIn.referenceDate).toEqual(referenceDate2);
    expect(checkInRepository.checkIns).toHaveLength(2);
  });
});

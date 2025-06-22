import { Calendar } from '@mantine/dates'
import { useRef, useState, useEffect, useMemo } from 'react';
import styles from './styles.module.css'

import { PaperPlaneRightIcon, TrashIcon } from "@phosphor-icons/react"
import { api } from '../../services/api'
import dayjs from 'dayjs';
import { Header } from '../../components/header';
import { Info } from '../../components/info';
import clsx from 'clsx';
import { Indicator } from '@mantine/core';


type Habit = {
    _id: string;
    name: string;
    completedDates: string[];
    userId: string;
    createdAt: string;
    updatedAt: string;
}

type HabitsMetrics = {
    _id: string;
    name: string;
    completedDates: string[];
}

export function Habits() {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [metrics, setMetrics] = useState<HabitsMetrics>({} as HabitsMetrics);
    const [selectHabit, setSelectHabit] = useState<Habit | null>(null);
    const nameInput = useRef<HTMLInputElement>(null);
    const today = dayjs().startOf('day');


    const metricsInfo = useMemo(() => {
        const numberOfMonthDays = today.endOf('month').get('date');
        const numberOfDays = metrics?.completedDates ? metrics?.completedDates?.length : 0;
        const completedDatesPerMonth = `${numberOfDays}/${numberOfMonthDays}`;

        const completedMonthPercent = `${Math.round(
            (numberOfDays / numberOfMonthDays) * 100,
        )}%`;

        return {
            completedDatesPerMonth,
            completedMonthPercent,
        }
    }, [metrics]);


    async function handleSelectHabit(habit: Habit, currentMonth?: Date) {
        setSelectHabit(habit);

        const { data } = await api.get<HabitsMetrics>(
            `/habits/${habit._id}/metrics`,
            {
                params: {
                    date: currentMonth ? currentMonth.toISOString() : today.startOf('month').toISOString(),
                }
            }
        );
        setMetrics(data);
    }



    async function loadHabits() {
        const { data } = await api.get<Habit[]>('/habits');
        setHabits(data);
    }

    async function handleSubmit() {
        const name = nameInput.current?.value;

        if (name) {
            await api.post('/habits', {
                name,
            })
            if (nameInput.current) {
                nameInput.current.value = "";
            }
        }
        await loadHabits();
    }


    async function handleToggle(habit: Habit) {
        await api.patch(`/habits/${habit._id}/toggle`);

        await loadHabits();
        await handleSelectHabit(habit);
    }

    async function handleDelete(id: string) {
        await api.delete(`/habits/${id}`);

        setMetrics({} as HabitsMetrics);
        setSelectHabit(null);

        await loadHabits();
    }

    function handleSelectMonth(date: string) {
        if (selectHabit) {
            const parsedDate = new Date(date);
            handleSelectHabit(selectHabit, parsedDate);
        }
    }


    useEffect(() => {
        loadHabits()
    }, [])



    return (

        <div className={styles.container}>
            <div className={styles.content}>
                <Header title="Hábitos Diários" />
                <div className={styles.inputContainer}>
                    <input
                        ref={nameInput}
                        placeholder='Adicione um novo hábito'
                        type='text'
                    />
                    <PaperPlaneRightIcon onClick={handleSubmit} />
                </div>
                <div className={styles.habitsList}>
                    {habits.map((item) => (
                        <div key={item._id} className={clsx(styles.habit, item._id === selectHabit?._id && styles['habit-active'])}>
                            <p onClick={async () => await handleSelectHabit(item)}>{item.name}</p>
                            <div>
                                <input
                                    type="checkbox"
                                    checked={item.completedDates.some((item) => item === today.toISOString())}
                                    onChange={() => handleToggle(item)}
                                />
                                <TrashIcon onClick={() => handleDelete(item._id)} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {selectHabit && (
                <div className={styles.metrics}>
                    <h2>{selectHabit.name}</h2>
                    <div className={styles.infoContainer}>
                        <Info value={metricsInfo.completedDatesPerMonth} label='Dias concluidos' />
                        <Info value={metricsInfo.completedMonthPercent} label='porcentagem' />
                    </div>
                    <div className={styles.calendarContainer}>
                        <Calendar
                            static
                            onMonthSelect={handleSelectMonth}
                            onNextMonth={handleSelectMonth}
                            onPreviousMonth={handleSelectMonth}
                            renderDay={(date) => {
                                const day = dayjs(date).date();
                                const isSameDate = metrics?.completedDates?.some((item) =>
                                    dayjs(item).isSame(dayjs(date))
                                );
                                return (
                                    <Indicator size={8} color="blue" offset={-2} disabled={!isSameDate}>
                                        <div>{day}</div>
                                    </Indicator>
                                );
                            }}
                        />
                    </div>
                </div>
            )}
        </div>

    )
}
import { isBefore } from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid'
import {
    add,
    eachDayOfInterval,
    endOfMonth,
    format,
    getDay,
    isEqual,
    isSameDay,
    isSameMonth,
    isToday,
    parse,
    parseISO,
    startOfToday,
} from 'date-fns'
import { Fragment, useState } from 'react'
import APICalls from "../../../services/APICalls.js";

const APIResponse = {
    "specialty": "string",
    "startTime": "14:30:00",
    "endTime": "18:30:00",
    "workingDays": [
        "SUN","MON","THU"
    ],
    "status": "Pending"
}

const dayMapping = {
    SUN: 0,
    MON: 1,
    TUE: 2,
    WED: 3,
    THU: 4,
    FRI: 5,
    SAT: 6,
}




// TODO:Construct Available Times from the data
const Reservations = [
    {
        id: 1,
        name: 'First Appointment',
        startDatetime: '2025-06-01T13:00',
        endDatetime: '2025-05-19T13:30',
    },
    {
        id: 2,
        name: 'Second Appointment',
        startDatetime: '2025-06-01T14:00',
        endDatetime: '2025-05-19T14:30',
    },
    {
        id: 3,
        name: 'Third Appointment',
        startDatetime: '2025-05-19T15:00',
        endDatetime: '2025-05-19T15:30',
    },
    {
        id: 4,
        name: 'Forth Appointment',
        startDatetime: '2025-05-19T16:00',
        endDatetime: '2022-06-19T16:30',
    },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}



export default function Calender({onDaySelect ,Doctor}) {
    let today = startOfToday()
    let [selectedDay, setSelectedDay] = useState(today)
    let [, setSelectedTime] = useState(today)

    let [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'))
    let firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date())

    let days = eachDayOfInterval({
        start: firstDayCurrentMonth,
        end: endOfMonth(firstDayCurrentMonth),
    })

    const [selectedId, setSelectedId] = useState(null);
    function handleTimeClick(selectedTime , id) {
        setSelectedId(id);
        setSelectedTime(selectedTime);
        if (onDaySelect) {
            onDaySelect(combineDateAndTime(selectedDay,selectedTime) , id); // Pass formatted day
        }
    }

    function previousMonth() {
        let firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 })
        setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'))
    }

    function nextMonth() {
        let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 })
        setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'))
    }

    let selectedDayMeetings = days.filter((meeting) =>
        isSameDay(meeting, selectedDay)
    )

    const reservedTimesForSelectedDay = (() => {
        const set = new Set();
        (Doctor?.reservationDates || []).forEach((iso) => {
            const d = parseISO(iso);
            if (!isNaN(d) && isSameDay(d, selectedDay)) {
                set.add(format(d, 'HH:mm'));
            }
        });
        return set;
    })();

    const availableAppointments = generateAppointments(
        Doctor.startTime,
        Doctor.endTime,
        Doctor.workingDays.map((day) => dayMapping[day]),
        reservedTimesForSelectedDay
    )
    function generateAppointments(startTime, endTime, workingDays , reservedTimesForDay = new Set()) {
        const start = parse(startTime, 'HH:mm:ss', new Date());
        const end = parse(endTime, 'HH:mm:ss', new Date());
        const AppointmentsIntervale = (Doctor?.visitDuration || 30);
        const appointments = [];
        let id = 1; // Initialize ID counter

        while (start < end) {
            const startTimeFormatted = format(start, 'HH:mm');
            start.setMinutes(start.getMinutes() + AppointmentsIntervale);
            const endTimeFormatted = format(start, 'HH:mm');

            appointments.push({ id: id++,
                startTime: startTimeFormatted,
                endTime: endTimeFormatted ,
                day: workingDays.map((day)=>day),
                disabled: reservedTimesForDay.has(startTimeFormatted)});
        }

        return appointments;
    }

    return (
        <div className="pt-0">
            <div className="max-w-md px-4 mx-auto sm:px-7 md:max-w-4xl md:px-6">
                <div className="md:grid md:grid-cols-2 md:divide-x md:divide-gray-200">
                    <div className="md:pr-14">
                        <div className="flex items-center">
                            <h2 className="flex-auto font-semibold text-gray-900">
                                {format(firstDayCurrentMonth, 'MMMM yyyy')}
                            </h2>
                            <button
                                type="button"
                                onClick={previousMonth}
                                className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                            >
                                <span className="sr-only">Previous month</span>
                                <ChevronLeftIcon className="w-5 h-5" aria-hidden="true" />
                            </button>
                            <button
                                onClick={nextMonth}
                                type="button"
                                className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                            >
                                <span className="sr-only">Next month</span>
                                <ChevronRightIcon className="w-5 h-5" aria-hidden="true" />
                            </button>
                        </div>
                        <div className="grid grid-cols-7 mt-10 text-xs leading-6 text-center text-gray-500">
                            <div>SUN</div>
                            <div>MON</div>
                            <div>TUE</div>
                            <div>WED</div>
                            <div>THU</div>
                            <div>FRI</div>
                            <div>SAT</div>
                        </div>
                        <div className="grid grid-cols-7 mt-2 text-sm ">
                            {days.map((day, dayIdx) => (
                                <div
                                    key={day.toString()}
                                    className={classNames(
                                        dayIdx === 0 && colStartClasses[getDay(day)],
                                        'py-1.5'
                                    )}
                                >
                                    <button
                                        type="button"
                                        onClick={async () => {
                                            setSelectedDay(day);
                                            const count = await APICalls.GetReservationCount(day.toLocaleString().split(',')[0] , Doctor.doctorId);
                                            console.log("count number :" , count);
                                        }
                                    }
                                        //TODO:Add vacations
                                        disabled={!isSameMonth(day, firstDayCurrentMonth) || isBefore(day, today) || !availableAppointments[0].day.includes(getDay(day)) || Doctor.vacations.includes(format(day, 'yyyy-MM-dd'))} // Example condition
                                        className={classNames(
                                            isEqual(day, selectedDay) && 'text-white',
                                            !isEqual(day, selectedDay) &&
                                            isToday(day) &&
                                            'text-red-500',
                                            !isEqual(day, selectedDay) &&
                                            !isToday(day) &&
                                            isSameMonth(day, firstDayCurrentMonth) &&
                                            'text-gray-900',
                                            !isEqual(day, selectedDay) &&
                                            !isToday(day) &&
                                            !isSameMonth(day, firstDayCurrentMonth) &&
                                            'text-gray-400',
                                            isEqual(day, selectedDay) && isToday(day) && 'bg-red-500',
                                            isEqual(day, selectedDay) &&
                                            !isToday(day) &&
                                            'bg-gray-900',
                                            !isEqual(day, selectedDay) && 'hover:bg-gray-200',
                                            (isEqual(day, selectedDay) || isToday(day)) &&
                                            'font-semibold',
                                            'mx-auto flex h-8 w-8 items-center justify-center rounded-full',
                                            (!isSameMonth(day, firstDayCurrentMonth) || isBefore(day, today)  || Doctor.vacations.includes(format(day, 'yyyy-MM-dd')) || !availableAppointments[0].day.includes(getDay(day)) )&&
                                            'opacity-50 cursor-not-allowed'

                                        )}
                                    >
                                        <time dateTime={format(day, 'yyyy-MM-dd')}>
                                            {format(day, 'd')}
                                        </time>
                                    </button>

                                    <div className="w-1 h-1 mx-auto mt-1">
                                        {!isBefore(day, today) && (availableAppointments[0].day.includes(getDay(day)) && !Doctor.vacations.includes(format(day, 'yyyy-MM-dd'))
                                        ) && (
                                            <div className="w-1 h-1 rounded-full bg-sky-500"></div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/*right Section*/}
                    <section className="pl-10">
                        <h2 className="font-semibold text-gray-900">
                            Available Times for{' '}
                            <time dateTime={format(selectedDay, 'yyyy-MM-dd')}>
                                {format(selectedDay, 'MMM dd, yyy')}
                            </time>
                        </h2>
                        <ol className="mt-2  text-sm leading-6  text-gray-500">
                            {selectedDayMeetings.length > 0 ? (
                               <div className="h-80 overflow-y-auto pr-10">
                                    {availableAppointments.map((appointments) => (
                                        <Meeting
                                            key={appointments.id}
                                            availableAppointments={appointments}
                                            onTimeClick={handleTimeClick}
                                            selectedId={selectedId}
                                        />
                                    ))}
                               </div>
                            ) : (
                                <p>No Reservations for today.</p>
                            )}
                        </ol>
                    </section>
                </div>
            </div>
        </div>
    )
}



function Meeting({availableAppointments ,  onTimeClick ,  selectedId}) {
    const disabled = !!availableAppointments.disabled;
    return (
        <button
            type="button"
            onClick={function () {
                return !disabled && onTimeClick(availableAppointments.startTime, Number(availableAppointments.id));
            }}
            className={
                "group flex items-center justify-between p-3 rounded-xl border border-border-light hover:border-primary cursor-pointer transition bg-gray-50 hover:bg-white mt-3 w-full hover:shadow-sm " +
                (disabled ? "opacity-50 cursor-not-allowed line-through" : "")
            }
            title={disabled ? "This time is already reserved" : ""}
        >
            <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-7  rounded-full bg-white text-xs font-bold text-gray-500 shadow-sm border">
                {availableAppointments.id}
            </span>
                <span className="text-gray-700 font-medium">
                {format(parse(availableAppointments.startTime, 'HH:mm', new Date()), 'h:mm a')}
                    {" - "}
                    {format(parse(availableAppointments.endTime, 'HH:mm', new Date()), 'h:mm a')}
            </span>
            </div>
            <div className="flex items-center gap-3">
                <span className="material-icons-round text-gray-400 text-lg">calendar_today</span>
                <input
                    className="w-4 h-4 text-primary border-gray-300 focus:ring-primary bg-white border"
                    name="time_slot"
                    type="radio"
                    checked={selectedId === availableAppointments.id}
                    readOnly
                    disabled={disabled}
                />
            </div>
        </button>
    )
}

function combineDateAndTime(selectedDay, startTime) {
    // Format the selected day as 'yyyy-MM-dd'
    const localDateTime = parse(
        `${format(selectedDay, 'yyyy-MM-dd')} ${startTime}`,
        'yyyy-MM-dd HH:mm',
        new Date()
    );

    return localDateTime.toISOString();
}

let colStartClasses = [
    '',
    'col-start-2',
    'col-start-3',
    'col-start-4',
    'col-start-5',
    'col-start-6',
    'col-start-7',
]

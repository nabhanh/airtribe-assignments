import { relations } from 'drizzle-orm';
import {
  date,
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  time,
  timestamp,
  uniqueIndex
} from 'drizzle-orm/pg-core';

const ForeignKeyAction = {
  onUpdate: 'cascade' as const,
  onDelete: 'cascade' as const
};

export const user = pgTable(
  'user',
  {
    id: integer('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    phone: text('phone').notNull(),
    password: text('password').notNull(),
    createdAt: timestamp('created_at', {
      withTimezone: true,
      precision: 6
    })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
      precision: 6
    })
      .notNull()
      .defaultNow()
  },
  table => ({
    emailIdx: uniqueIndex('email_idx').on(table.email)
  })
);

export const usersRelations = relations(user, ({ many }) => ({
  bookings: many(user_booking)
}));

export type User = typeof user.$inferSelect;
export type UserInsert = typeof user.$inferInsert;

export const theatre = pgTable(
  'theatre',
  {
    theatre_id: integer('theatre_id').primaryKey(),
    name: text('name').notNull(),
    address: text('address').notNull(),
    city: text('city').notNull(),
    state: text('state').notNull(),
    pincode: integer('pincode').notNull(),
    created_at: timestamp('created_at', {
      withTimezone: true,
      precision: 6
    }).notNull(),
    updated_at: timestamp('updated_at', {
      withTimezone: true,
      precision: 6
    }).notNull()
  },
  table => ({
    cityIdx: index('city_idx').on(table.city)
  })
);

export type Theatre = typeof theatre.$inferSelect;
export type TheatreInsert = typeof theatre.$inferInsert;

export const movie = pgTable('movie', {
  movie_id: integer('movie_id').primaryKey(),
  name: text('name').notNull(),
  language: text('language').notNull(),
  duration: integer('duration').notNull(),
  release_date: text('release_date').notNull(),
  created_at: timestamp('created_at', {
    withTimezone: true,
    precision: 6
  }).notNull(),
  updated_at: timestamp('updated_at', {
    withTimezone: true,
    precision: 6
  }).notNull()
});

export type Movie = typeof movie.$inferSelect;
export type MovieInsert = typeof movie.$inferInsert;

export const movie_theatre = pgTable(
  'movie_theatre',
  {
    movie_id: integer('movie_id').notNull(),
    theatre_id: integer('theatre_id').notNull(),
    created_at: timestamp('created_at', {
      withTimezone: true,
      precision: 6
    }).notNull(),
    updated_at: timestamp('updated_at', {
      withTimezone: true,
      precision: 6
    }).notNull()
  },
  movie_theatre => ({
    movie_theatre_pk: uniqueIndex('movie_theatre_pk').on(
      movie_theatre.movie_id,
      movie_theatre.theatre_id
    )
  })
);

export const movieTheatreRelations = relations(movie_theatre, ({ one }) => ({
  movie: one(movie),
  theatre: one(theatre)
}));

export type MovieTheatre = typeof movie_theatre.$inferSelect;
export type MovieTheatreInsert = typeof movie_theatre.$inferInsert;

export const screen = pgTable('screen', {
  screen_id: integer('screen_id').primaryKey(),
  name: text('name').notNull(),
  theatre_id: integer('theatre_id')
    .notNull()
    .references(() => theatre.theatre_id, ForeignKeyAction),
  rows: integer('rows').notNull(),
  seat_count: integer('seat_count').notNull(),
  created_at: timestamp('created_at', {
    withTimezone: true,
    precision: 6
  }).notNull(),
  updated_at: timestamp('updated_at', {
    withTimezone: true,
    precision: 6
  }).notNull()
});

export const screenRelations = relations(screen, ({ one }) => ({
  theatre: one(theatre)
}));

export type Screen = typeof screen.$inferSelect;
export type ScreenInsert = typeof screen.$inferInsert;

export const screen_seat = pgTable(
  'screen_seat',
  {
    screen_id: integer('screen_id')
      .notNull()
      .references(() => screen.screen_id, ForeignKeyAction),
    seat_row: integer('seat_row').notNull(),
    seat_column: text('seat_column').notNull(),
    created_at: timestamp('created_at', {
      withTimezone: true,
      precision: 6
    }).notNull(),
    updated_at: timestamp('updated_at', {
      withTimezone: true,
      precision: 6
    }).notNull()
  },
  screen_seat => ({
    pk: primaryKey(
      screen_seat.screen_id,
      screen_seat.seat_row,
      screen_seat.seat_column
    )
  })
);

export const screenSeatRelations = relations(screen_seat, ({ one }) => ({
  screen: one(screen)
}));

export type ScreenSeat = typeof screen_seat.$inferSelect;
export type ScreenSeatInsert = typeof screen_seat.$inferInsert;

export const movie_screening = pgTable('movie_screening', {
  movie_screening_id: integer('movie_screening_id').primaryKey(),
  movie_id: integer('movie_id')
    .notNull()
    .references(() => movie.movie_id, ForeignKeyAction),
  screen_id: integer('screen_id')
    .notNull()
    .references(() => screen.screen_id, ForeignKeyAction),
  start_time: time('start_time').notNull(),
  end_time: time('end_time').notNull(),
  start_date: date('start_date').notNull(),
  end_date: date('end_date').notNull(),
  custom_repeat: text('custom_repeat').default('RRULE:FREQ=DAILY;'),
  created_at: timestamp('created_at', {
    withTimezone: true,
    precision: 6
  }).notNull(),
  updated_at: timestamp('updated_at', {
    withTimezone: true,
    precision: 6
  }).notNull()
});

export const movieScreeningRelations = relations(
  movie_screening,
  ({ one }) => ({
    movie: one(movie),
    screen: one(screen)
  })
);

export type MovieScreening = typeof movie_screening.$inferSelect;
export type MovieScreeningInsert = typeof movie_screening.$inferInsert;

export const user_booking = pgTable('user_booking', {
  booking_id: integer('booking_id').primaryKey(),
  user_id: integer('user_id')
    .notNull()
    .references(() => user.id, ForeignKeyAction),
  movie_screening_id: integer('movie_screening_id').references(
    () => movie_screening.movie_screening_id,
    ForeignKeyAction
  ),
  seat_count: integer('seat_count').notNull().default(1),
  created_at: timestamp('created_at', {
    withTimezone: true,
    precision: 6
  }).notNull(),
  updated_at: timestamp('updated_at', {
    withTimezone: true,
    precision: 6
  }).notNull()
});

export const userBookingRelations = relations(user_booking, ({ one }) => ({
  user: one(user),
  movieScreening: one(movie_screening)
}));

export type UserBooking = typeof user_booking.$inferSelect;
export type UserBookingInsert = typeof user_booking.$inferInsert;

export const booking_seat = pgTable(
  'booking_seat',
  {
    booking_id: integer('booking_id')
      .notNull()
      .references(() => user_booking.booking_id, ForeignKeyAction),
    seat_row: integer('seat_row').notNull(),
    seat_column: text('seat_column').notNull(),
    created_at: timestamp('created_at', {
      withTimezone: true,
      precision: 6
    }).notNull(),
    updated_at: timestamp('updated_at', {
      withTimezone: true,
      precision: 6
    }).notNull()
  },
  booking_seat => ({
    pk: primaryKey(
      booking_seat.booking_id,
      booking_seat.seat_row,
      booking_seat.seat_column
    )
  })
);

export const bookingSeatRelations = relations(booking_seat, ({ one }) => ({
  userBooking: one(user_booking)
}));

export type BookingSeat = typeof booking_seat.$inferSelect;
export type BookingSeatInsert = typeof booking_seat.$inferInsert;

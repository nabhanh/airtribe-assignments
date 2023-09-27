// filename: theatre.ts
// All theartre related routes are defined here

import { Router } from 'express';
import db from '../../db/db';
import { logger } from '../../lib/logger';
import { and, eq, lte } from 'drizzle-orm';
import { movie, movie_screening, screen, theatre } from '../../db/schema';
import client from '../../lib/redis';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const city = req.query.city as string;

    if (!city) return res.status(400).json({ message: 'City is required' });
    //check redis cache
    const cachedResponse = await client.get(`theatres:${city}`);
    if (cachedResponse) {
      return res.json(JSON.parse(cachedResponse));
    }

    const theatres = await db.query.theatre.findMany({
      where: eq(theatre.city, city)
    });

    //set redis cache
    await client.set(`theatres:${city}`, JSON.stringify(theatres), {
      EX: 60 * 60 * 24 * 30 // 7 days
    });

    return res.json(theatres);
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ message: 'Something went wrong' });
  }
});

router.get('/:id/movies', async (req, res) => {
  try {
    const theatreId = Number(req.params.id);
    const date = new Date(req.query.date as string);
    if (!date || date.toString() === 'Invalid Date')
      return res.status(400).json({ message: 'Date is required' });
    if (!theatreId)
      return res.status(400).json({ message: 'Theatre id is required' });

    const movies = await db
      .select()
      .from(movie)
      .leftJoin(movie_screening, eq(movie.movie_id, movie_screening.movie_id))
      .leftJoin(
        screen,
        and(
          eq(movie_screening.screen_id, screen.screen_id),
          lte(movie_screening, date.toISOString())
        )
      )
      .leftJoin(theatre, eq(screen.theatre_id, theatre.theatre_id))
      .where(eq(theatre.theatre_id, theatreId));

    return res.json(movies);
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ message: 'Something went wrong' });
  }
});

export default router;

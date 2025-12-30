# Database Integration Setup

All data is now stored in MongoDB. Follow these steps to complete the setup:

## 1. Start the Backend Server

```bash
cd backend
npm start
```

The backend server runs on `http://localhost:5000`

## 2. Environment Variables

Make sure your `.env.local` file includes:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 3. Database Models Created

- **Portfolio**: Projects with title, category, year, location, description, image, area, client, status, keyFeatures
- **Team**: Team members with name, position, category, image, phone, linkedin
- **Shop**: Products with name, price, category, image
- **Academic**: Publications with title, author, year, description, pdfLink
- **SocialLinks**: Social media links (facebook, twitter, linkedin, instagram)
- **Partner**: Partner logos with logo URL and optional name

## 4. API Endpoints

All endpoints are available at:
- `GET/POST /api/portfolio`
- `GET/PUT/DELETE /api/portfolio/:id`
- `GET/POST /api/team`
- `GET/PUT/DELETE /api/team/:id`
- `GET/POST /api/shop`
- `GET/PUT/DELETE /api/shop/:id`
- `GET/POST /api/academic`
- `GET/PUT/DELETE /api/academic/:id`
- `GET/PUT /api/social`
- `GET/POST /api/partners`
- `DELETE /api/partners/:id`

## 5. Next Steps

The admin dashboard has been updated to:
- Fetch all data from the database on login
- Save new items to the database
- Update existing items in the database
- Delete items from the database

**Note**: You'll need to update the form submission handlers to properly save data. The structure is in place, but form inputs need to be connected to the save functions.


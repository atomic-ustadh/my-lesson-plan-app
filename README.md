# 📝 Lesson Planner

A comprehensive, bilingual (English/Arabic) lesson planning application designed specifically for Islamic schools and educators. Built with modern web technologies and featuring robust role-based access control. [Visit Website](https://mysupabaselessonplan.netlify.app/)

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.x-61dafb.svg)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E.svg)

## ✨ Features

### 🌍 Bilingual Support
- **Full RTL Support**: Seamless right-to-left layout for Arabic
- **Dynamic Language Switching**: Toggle between English and Arabic instantly
- **Localized Content**: All UI elements, dropdowns, and labels adapt to the selected language
- **Smart Data Handling**: Stores English values in database while displaying localized labels

### 👥 Role-Based Access Control
- **Teacher Role**:
  - Create, edit, and manage their own lesson plans
  - View and duplicate their lessons
  - Filter lessons by subject and week
  - Print-friendly lesson views

- **Admin Role**:
  - Full supervisor access to all lesson plans
  - View, edit, and delete any teacher's lessons
  - Filter by teacher, subject, and week
  - Cannot duplicate lessons (supervisor oversight only)


### 📚 Comprehensive Lesson Planning
Each lesson plan includes:
- **Basic Information**: Subject, Topic, Week, Date, Duration, Grade, Period, Age
- **Core Content**: Introduction, Learning Objectives, Summary, Methodology
- **Resources & Evaluation**: Teaching resources, evaluation methods, assignments
- **Comments**: Teacher and supervisor comment sections
- **Print Support**: Clean, professional print layout

### 🔐 Security Features
- **Row Level Security (RLS)**: Database-level access control
- **Secure Authentication**: Powered by Supabase Auth
- **Password Recovery**: Email-based password reset flow
- **Session Management**: Automatic session handling and logout

## 🚀 Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Custom Language Context** - Internationalization with `LanguageContext` and `translations.js`

### Backend
- **Supabase** - Backend as a Service
  - PostgreSQL database
  - Authentication
  - Row Level Security (RLS)
  - Real-time subscriptions

## 📋 Prerequisites

Before you begin, ensure you have:
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Supabase Account** ([Sign up here](https://supabase.com))

## 🛠️ Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/my-lesson-plan-app.git
cd my-lesson-plan-app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get these values from your Supabase project settings:
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to Settings → API
4. Copy the Project URL and anon/public key

### 4. Database Setup

#### Create Tables
Run the following SQL in your Supabase SQL Editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE,
    role TEXT DEFAULT 'teacher' CHECK (role IN ('teacher', 'admin')),
    full_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create lesson_plans table
CREATE TABLE public.lesson_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    subject TEXT,
    grade_level TEXT,
    content JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Set Up Row Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_plans ENABLE ROW LEVEL SECURITY;

-- Create is_admin() helper function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles policies
CREATE POLICY "Users can view own profile or admins can view all"
ON public.profiles FOR SELECT
TO authenticated
USING (is_admin() OR id = auth.uid());

CREATE POLICY "Users can update own profile or admins can update all"
ON public.profiles FOR UPDATE
TO authenticated
USING (is_admin() OR id = auth.uid())
WITH CHECK (is_admin() OR id = auth.uid());

CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Lesson plans policies
CREATE POLICY "Owner or admin can view lesson_plans"
ON public.lesson_plans FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "Owner can insert lesson_plans"
ON public.lesson_plans FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owner or admin can update lesson_plans"
ON public.lesson_plans FOR UPDATE
TO authenticated
USING (auth.uid() = user_id OR is_admin())
WITH CHECK (auth.uid() = user_id OR is_admin());

CREATE POLICY "Owner or admin can delete lesson_plans"
ON public.lesson_plans FOR DELETE
TO authenticated
USING (auth.uid() = user_id OR is_admin());
```

#### Create Trigger for Auto Profile Creation

```sql
-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    'teacher'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 5. Configure Supabase Authentication

In your Supabase Dashboard:
1. Go to Authentication → URL Configuration
2. Set **Site URL** to your deployment URL (e.g., `https://yourapp.netlify.app`)
3. Add **Redirect URLs**:
   - `http://localhost:5173/login` (for development)
   - `https://yourapp.netlify.app/login` (for production)

### 6. Run the Application

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 📱 Usage

### First Time Setup
1. **Sign Up**: Create an account (defaults to 'teacher' role)
2. **Admin Setup**: Manually update a user's role to 'admin' in Supabase by editing the `role` column of the `profiles` table manually or using the SQL Editor in the Supabase Dashboard:
   ```sql
   UPDATE public.profiles 
   SET role = 'admin' 
   WHERE email = 'admin@example.com';
   ```

### Creating a Lesson Plan
1. Log in as a teacher
2. Click "New Lesson" button
3. Fill in the lesson details:
   - Select subject, grade, and week from dropdowns
   - Enter topic, objectives, methodology, etc.
4. Click "Save"

### Filtering Lessons
- **Teachers**: Use Subject and Week filters
- **Admins**: Additional Teacher filter to view specific teacher's lessons
- Click "Clear Filters" to reset

### Language Switching
Click the language toggle button in the navigation bar:
- 🇺🇸 English
- 🇮🇶 العربية (Arabic)

## 🎨 Customization

### Adding New Subjects
Edit `src/constants.js`:
```javascript
export const getSubjects = (language = 'en') => {
    const subjects = [
        { value: "New Subject", label_en: "New Subject", label_ar: "مادة جديدة" },
        // ... existing subjects
    ];
    // ...
};
```

### Modifying Weeks
Edit `src/constants.js` to change the number of weeks or their labels.

### Styling
The app uses Tailwind CSS. Customize colors and styles in:
- `tailwind.config.js` - Global theme
- Component files - Component-specific styles

## 🚢 Deployment

### Netlify Deployment

1. **Create `public/_redirects` file** (already included):
   ```
   /* /index.html 200
   ```

2. **Build the app**:
   ```bash
   npm run build
   ```

3. **Deploy to Netlify**:
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Add environment variables in Netlify dashboard

4. **Update Supabase URLs**:
   - Add your Netlify URL to Supabase redirect URLs

## 🔧 Troubleshooting

### Password Recovery Not Working
- Ensure Site URL is set correctly in Supabase
- Check that redirect URLs include your deployment domain
- Verify email templates in Supabase → Authentication → Email Templates

### Teacher Names Show "Unknown"
- Verify RLS policies allow admins to view profiles
- Check that `is_admin()` function exists and works correctly

### Filters Not Working
- Check browser console for errors
- Verify JSONB structure in database matches expected format
- Ensure RLS policies allow the query

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check existing documentation
- Review Supabase logs for backend errors

## 🙏 Acknowledgments

- Built with [React](https://react.dev/)
- Powered by [Supabase](https://supabase.com)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- Icons from [Heroicons](https://heroicons.com)

---

**Made with ❤️ for Islamic Education**

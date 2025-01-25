# Roadmap

## Stage 1. Preparation and Design
1. **Idea and Goals**  
   - Monitor good habits and eliminate bad habits.  
   - Track progress (water intake, steps, etc.).  
   - Ability to add friends and see each other's progress.  
   - Registration through email or Google.  
   - Main screen: habit list, horizontal scrolling calendar, toggle switch for showing only good or only bad habits, water tracking.  
   - Additional screens: articles, settings, add-habit.  

2. **Technology Choices**  
   - **React Native (Expo)** for the mobile app.  
   - Potential backend for data syncing, friend sharing, etc. (could be a separate service or a BaaS solution).  

3. **Prototype**  
   - Create wireframes/mockups (e.g., in Figma).  
   - Decide on core UI flows and finalize layout of main, friends, sign-up, articles, settings, and add-habit screens.

---

## Stage 2. Basic App Structure
1. **Project Setup**  
   - Initialize Expo project.  
   - Install core dependencies (React Navigation, gesture-handler, reanimated).  
   - Configure navigation (Stack, Drawer, or Bottom Tabs).

2. **Auth Screen**  
   - Email/password registration.  
   - Google login integration.  
   - Token storage (AsyncStorage or Redux Persist).

3. **Main (Habits) Screen**  
   - Horizontal calendar on top.  
   - List of habits (good and bad).  
   - Switch to show only good or only bad habits.  
   - Simple water tracker (could be a counter or progress bar).

4. **Add-Habit Screen**  
   - Form to create a habit: name, goal, type (good/bad), description, frequency.

5. **Settings Screen**  
   - Edit profile.  
   - Toggle health data sync (HealthKit/Google Fit).  
   - Notification settings.

6. **Articles Screen**  
   - List of articles (placeholder data).  
   - Potential real data source in the future.

---

## Stage 3. Water and Steps Tracking
1. **Water Tracking**  
   - Block on main screen or separate screen.  
   - Input for amount of water consumed.  
   - Daily progress visualization (circular chart, bar, or numeric display).  
   - Data saved locally or in backend.

2. **Health App Sync**  
   - Integrate Apple HealthKit (iOS) and Google Fit (Android).  
   - Fetch step count.  
   - Combine daily progress with friends' tracking (see if they reached 10,000 steps).  
   - Requires authorization flow.

3. **Friends System**  
   - Add/search friends.  
   - View your friends list
   - While creating a habit, you can select a friend to share the habit with

---

## Stage 4. Social Features and UI Enhancements
1. **Friends Screen**  
   - List of friends and their current habits.  
   - Shared habit goals (e.g., everyone hitting 10,000 steps/day).  
   - Optional comments, reactions, or messaging.

2. **Notifications**  
   - Local notifications via Expo for habit reminders.  
   - Push notifications for friend updates (optional).

3. **UI/UX Improvements**  
   - Better animations (transitions, gestures).  
   - More advanced filter or sorting for habits.

4. **Articles**  
   - Enhance the articles screen.  
   - Integrate real RSS/API if needed.

---

## Stage 5. Optimization, Deployment, and Testing
1. **Optimization**  
   - Performance improvements for lists (FlatList/SectionList).  
   - Minimize app size (Expo config, etc.).

2. **Testing**  
   - Unit tests with Jest.  
   - E2E tests with Detox or Appium.  
   - Test across various iOS/Android devices.

3. **Deployment**  
   - Expo builds for iOS/Android.  
   - App Store/Google Play submission if desired.

4. **Feedback**  
   - Gather user feedback.  
   - Decide on new features or refinements.

---

## Stage 6. Additional Features and Roadmap Extensions
1. **Gamification**  
   - Points, badges, levels.  
   - Leaderboards for friends or global ranking.

2. **Extended Analytics**  
   - Graphs for weight, sleep, mood changes.  
   - Export or share data.

3. **Cross-Platform**  
   - Consider React Native Web or an Electron-based desktop version.

4. **Monetization**  
   - Subscriptions or premium features.  
   - Ads or partner integrations.
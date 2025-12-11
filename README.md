<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1fd5Jh6RHF6DgfyuVvbKougwZgm29mU1G

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deployment to GitHub Pages

This project is configured to automatically deploy to GitHub Pages when changes are pushed to the `main` branch.

### How it works

1. The GitHub Actions workflow (`.github/workflows/deploy-gh-pages.yml`) runs on every push to `main`
2. It installs dependencies, builds the app, and deploys the build output to the `gh-pages` branch
3. GitHub Pages then serves the app from the `gh-pages` branch at: https://AngeloRai.github.io/euro-explorer

### Adjusting the build output directory

This project uses **Vite**, which outputs the build to `./dist` by default. If you switch to a different build tool:

- **create-react-app**: Change `publish_dir: ./dist` to `publish_dir: ./build` in the workflow file
- **Next.js**: Requires static export configuration (`next export`) and then use `publish_dir: ./out`
- **Other tools**: Check your build tool's documentation for the output directory

To change the publish directory, edit `.github/workflows/deploy-gh-pages.yml` and update the `publish_dir` value in the "Deploy to GitHub Pages" step.


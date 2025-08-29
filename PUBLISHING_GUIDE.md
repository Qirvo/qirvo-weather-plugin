# Qirvo Plugin Publishing Guide

This guide explains how to upload and publish your Qirvo plugin to the marketplace.

## 📦 Publishing Your Plugin

### Step 1: Prepare Your Plugin for Publishing

1. **Ensure Plugin Structure:**
   ```
   your-plugin/
   ├── package.json          # NPM package configuration
   ├── manifest.json         # Qirvo plugin manifest
   ├── src/                  # Source code
   │   ├── index.ts         # Main plugin entry
   │   └── widget.tsx       # Dashboard widget (optional)
   ├── dist/                # Compiled output
   ├── README.md            # Documentation
   └── CHANGELOG.md         # Version history
   ```

2. **Validate Package.json:**
   ```json
   {
     "name": "@qirvo/plugin-your-name",
     "version": "1.0.0",
     "description": "Your plugin description",
     "main": "dist/index.js",
     "qirvo": {
       "minVersion": "1.0.0",
       "category": "utilities",
       "tags": ["tag1", "tag2"],
       "permissions": ["network", "storage"],
       "price": 0,
       "free": true
     }
   }
   ```

3. **Validate Manifest.json:**
   ```json
   {
     "manifest_version": 1,
     "name": "Your Plugin Name",
     "version": "1.0.0",
     "description": "Plugin description",
     "author": {
       "name": "Your Name",
       "email": "your@email.com"
     },
     "permissions": [
       {
         "type": "network",
         "description": "Access external APIs",
         "required": true
       }
     ]
   }
   ```

### Step 2: Build and Test

1. **Build Your Plugin:**
   ```bash
   npm run build
   ```

2. **Test Locally:**
   ```bash
   # Install locally for testing
   qirvo plugin install ./
   
   # Test functionality
   qirvo plugin test your-plugin-name
   ```

3. **Run Plugin Validation:**
   ```bash
   # Validate plugin structure and manifest
   qirvo plugin validate ./
   ```

### Step 3: Create Distribution Package

1. **Create NPM Package:**
   ```bash
   npm pack
   ```

2. **Verify Package Contents:**
   ```bash
   tar -tzf your-plugin-1.0.0.tgz
   ```

### Step 4: Upload to Qirvo Marketplace

#### Method A: Using Qirvo CLI (Recommended)

1. **Login to Qirvo:**
   ```bash
   qirvo auth login
   ```

2. **Publish Plugin:**
   ```bash
   qirvo plugin publish ./your-plugin-1.0.0.tgz
   ```

3. **Add Screenshots (Optional):**
   ```bash
   qirvo plugin add-screenshot your-plugin-name ./screenshot1.png
   qirvo plugin add-screenshot your-plugin-name ./screenshot2.png
   ```

#### Method B: Web Upload

1. **Visit Qirvo Developer Portal:**
   - Go to [https://developer.qirvo.ai](https://developer.qirvo.ai)
   - Sign in with your Qirvo account

2. **Upload Plugin:**
   - Click "Upload New Plugin"
   - Drag and drop your `.tgz` file
   - Fill in marketplace details
   - Add screenshots and description

3. **Submit for Review:**
   - Click "Submit for Review"
   - Wait for approval (usually 1-3 business days)

## 🔍 Plugin Review Process

### Automated Checks

Your plugin will be automatically checked for:

1. **Security Vulnerabilities:**
   - Malicious code detection
   - Dependency security scan
   - Permission validation

2. **Code Quality:**
   - TypeScript compilation
   - Linting standards
   - Test coverage

3. **Manifest Validation:**
   - Required fields present
   - Version compatibility
   - Permission declarations

### Manual Review

Qirvo team reviews for:

1. **Functionality:**
   - Plugin works as described
   - No conflicts with core features
   - Proper error handling

2. **User Experience:**
   - Clear documentation
   - Intuitive interface
   - Helpful error messages

3. **Marketplace Guidelines:**
   - Appropriate category
   - Accurate description
   - Professional presentation

### Review Timeline

- **Automated Checks:** 5-10 minutes
- **Manual Review:** 1-3 business days
- **Total Time:** Usually within 24-72 hours

## 💰 Monetization Options

### Free Plugins

- No cost to users
- Great for building reputation
- Can include donation links
- Featured in "Free" category

### Paid Plugins

1. **Set Your Price:**
   ```json
   {
     "qirvo": {
       "price": 499,  // $4.99 in cents
       "free": false,
       "currency": "USD"
     }
   }
   ```

2. **Revenue Share:**
   - Qirvo takes 30% platform fee
   - You receive 70% of sales
   - Monthly payouts via Stripe

3. **Pricing Guidelines:**
   - Simple utilities: $1-5
   - Advanced integrations: $5-20
   - Enterprise features: $20-50

### Freemium Model

1. **Basic Version (Free):**
   ```json
   {
     "name": "@qirvo/plugin-basic",
     "qirvo": {
       "price": 0,
       "free": true
     }
   }
   ```

2. **Pro Version (Paid):**
   ```json
   {
     "name": "@qirvo/plugin-pro",
     "qirvo": {
       "price": 999,
       "free": false
     }
   }
   ```

## 📊 Analytics and Metrics

### Plugin Dashboard

Access your plugin analytics at [developer.qirvo.ai](https://developer.qirvo.ai):

1. **Download Statistics:**
   - Total downloads
   - Daily/weekly/monthly trends
   - Geographic distribution

2. **Revenue Tracking:**
   - Sales volume
   - Revenue trends
   - Payout history

3. **User Feedback:**
   - Ratings and reviews
   - Support requests
   - Feature requests

### Performance Metrics

Monitor your plugin's performance:

```bash
# View plugin statistics
qirvo plugin stats your-plugin-name

# Download detailed analytics
qirvo plugin analytics your-plugin-name --format csv
```

## 🔄 Updating Your Plugin

### Version Management

1. **Semantic Versioning:**
   - Major: Breaking changes (1.0.0 → 2.0.0)
   - Minor: New features (1.0.0 → 1.1.0)
   - Patch: Bug fixes (1.0.0 → 1.0.1)

2. **Update Process:**
   ```bash
   # Update version
   npm version patch  # or minor/major
   
   # Rebuild
   npm run build
   
   # Publish update
   qirvo plugin publish ./
   ```

### Migration Handling

For breaking changes, provide migration scripts:

```typescript
// In your plugin's update hook
async update(oldVersion: string, newVersion: string): Promise<void> {
  if (oldVersion < '2.0.0' && newVersion >= '2.0.0') {
    await this.migrateToV2();
  }
}
```

## 🛡️ Security Best Practices

### Code Security

1. **Input Validation:**
   ```typescript
   // Always validate user inputs
   function validateLocation(location: string): boolean {
     return /^[a-zA-Z\s,.-]+$/.test(location);
   }
   ```

2. **API Key Protection:**
   ```typescript
   // Never log or expose API keys
   const apiKey = await this.storage.get('apiKey');
   if (!apiKey) {
     throw new Error('API key not configured');
   }
   ```

3. **Permission Requests:**
   ```json
   {
     "permissions": [
       {
         "type": "network",
         "description": "Access weather API for current conditions",
         "required": true
       }
     ]
   }
   ```

### Data Privacy

1. **Minimal Data Collection:**
   - Only collect necessary data
   - Clear privacy policy
   - User consent for optional data

2. **Secure Storage:**
   ```typescript
   // Use plugin storage API for sensitive data
   await this.storage.set('userPreferences', preferences);
   ```

3. **GDPR Compliance:**
   - Data deletion on uninstall
   - User data export capability
   - Clear data usage policies

## 📝 Documentation Requirements

### Required Documentation

1. **README.md:**
   - Clear description
   - Installation instructions
   - Usage examples
   - Configuration options

2. **CHANGELOG.md:**
   - Version history
   - Feature additions
   - Bug fixes
   - Breaking changes

3. **API Documentation:**
   - Function signatures
   - Parameter descriptions
   - Return values
   - Examples

### Documentation Templates

Use our templates for consistency:

```bash
# Download documentation templates
qirvo plugin template docs
```

## 🎯 Marketing Your Plugin

### Marketplace Optimization

1. **Compelling Description:**
   - Clear value proposition
   - Key features highlighted
   - Use cases explained

2. **Quality Screenshots:**
   - Show plugin in action
   - Multiple views/features
   - High resolution images

3. **SEO Keywords:**
   - Relevant tags
   - Searchable terms
   - Category alignment

### Community Engagement

1. **Social Media:**
   - Share on Twitter/LinkedIn
   - Demo videos
   - User testimonials

2. **Qirvo Community:**
   - Discord announcements
   - Forum discussions
   - User support

3. **Content Marketing:**
   - Blog posts
   - Tutorial videos
   - Case studies

## 📞 Developer Support

### Getting Help

1. **Developer Documentation:** [docs.qirvo.ai/developers](https://docs.qirvo.ai/developers)
2. **Developer Discord:** [discord.gg/qirvo-dev](https://discord.gg/qirvo-dev)
3. **Email Support:** developer-support@qirvo.ai
4. **Office Hours:** Fridays 2-4 PM PST

### Resources

1. **Plugin SDK:** `npm install @qirvo/plugin-sdk`
2. **Example Plugins:** [github.com/qirvo/example-plugins](https://github.com/qirvo/example-plugins)
3. **Development Tools:** [github.com/qirvo/dev-tools](https://github.com/qirvo/dev-tools)

---

## ✅ Publishing Checklist

### Pre-Submission
- [ ] Plugin built and tested locally
- [ ] All dependencies included
- [ ] Manifest.json validated
- [ ] README.md complete
- [ ] Screenshots prepared
- [ ] Version number updated

### Submission
- [ ] Plugin uploaded to marketplace
- [ ] Description and tags added
- [ ] Screenshots uploaded
- [ ] Pricing configured (if paid)
- [ ] Submitted for review

### Post-Approval
- [ ] Plugin listed in marketplace
- [ ] Analytics dashboard configured
- [ ] Community announcement posted
- [ ] Documentation published

**Ready to publish? Your plugin is now ready for the Qirvo community! 🚀**

---

*For additional support, visit our [developer portal](https://developer.qirvo.ai) or join our [developer Discord](https://discord.gg/qirvo-dev).*

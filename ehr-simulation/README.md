# EHR Simulation Interface for Nurse Training

A professional, web-based Electronic Health Record (EHR) simulation interface designed for nursing students to practice documentation and workflow skills in realistic clinical scenarios.

## Features

### Six Comprehensive EHR Sections

1. **Patient Demographics**
   - Complete patient information (MRN, name, DOB, contact details)
   - Emergency contact information
   - Allergy documentation with severity indicators
   - Code status tracking
   - Insurance information

2. **Vital Signs**
   - Record BP, HR, RR, Temperature, SpO2
   - Pain assessment (0-10 scale with location)
   - Weight/Height with automatic BMI calculation
   - Vital signs history table
   - Multiple temperature routes and O2 delivery methods

3. **Medication Administration Record (MAR)**
   - Add medications with dose, route, frequency
   - Medication administration tracking
   - Site rotation for injections
   - Administration log with nurse initials
   - PRN and scheduled medication support

4. **Nursing Assessments**
   - Head-to-toe assessment forms
   - System-specific assessments:
     - Neurological (LOC, pupils, motor function)
     - Cardiovascular (heart sounds, pulses, edema)
     - Respiratory (lung sounds, oxygen needs)
     - Gastrointestinal (bowel sounds, diet tolerance)
     - Genitourinary (urine output, catheter care)
     - Integumentary (skin integrity, wounds)
     - Musculoskeletal (mobility, fall risk)

5. **Care Plans & Interventions**
   - Nursing diagnosis selection
   - Patient goals (short-term and long-term)
   - Planned interventions
   - Active care plan tracking
   - NANDA-approved diagnoses

6. **Communication & Handoff Tools**
   - SBAR (Situation, Background, Assessment, Recommendation) format
   - Shift report documentation
   - Communication log
   - Provider and family communication tracking

### Technical Features

- **Data Persistence**: All data automatically saves to browser localStorage
- **Auto-Save**: Changes are saved automatically as you type
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Professional Interface**: Clean, clinical design matching real EHR systems
- **Print-Friendly**: Documentation can be printed for review
- **No Server Required**: Runs entirely in the browser as a static web application

## Getting Started

### Installation

No installation required! Simply open `index.html` in any modern web browser.

### Usage

1. Open `index.html` in your web browser
2. Navigate between sections using the tab buttons at the top
3. Fill in patient information, vital signs, medications, assessments, etc.
4. All data is automatically saved to your browser
5. Data persists between sessions (until browser cache is cleared)

### For Simulation Training

**Instructors can:**
- Create realistic patient scenarios
- Assign students to document patient care
- Review student documentation by having them share screenshots or print output
- Reset scenarios by clearing browser data

**Students can:**
- Practice realistic EHR documentation
- Learn proper nursing assessment documentation
- Practice SBAR communication
- Develop medication administration recording skills
- Build care plans based on patient scenarios

## File Structure

```
ehr-simulation/
├── index.html      # Main application structure
├── style.css       # Professional medical interface styling
├── script.js       # Interactive functionality and data management
└── README.md       # This file
```

## Browser Compatibility

Works with all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## Data Storage

All data is stored locally in your browser using localStorage. This means:
- ✅ No internet connection required
- ✅ Data persists between sessions
- ✅ Complete privacy (no data sent to servers)
- ⚠️ Data is tied to the browser/device used
- ⚠️ Clearing browser cache will delete all data

## Customization

To customize for your simulation center:
- Edit the default patient in the header (lines 29-45 in index.html)
- Modify nursing diagnoses list (lines 617-628 in index.html)
- Adjust color scheme in style.css (lines 5-21, CSS custom properties)
- Add custom fields as needed

## Future Enhancements

Potential features for a dynamic version:
- Multi-user support with instructor dashboard
- Patient scenario templates
- Export/import scenarios
- Student performance tracking
- Integration with simulation equipment
- Video recording of documentation process

## License

Free to use for educational purposes.

## Support

For questions or issues, please contact the development team.

---

**Made for nursing education** 🏥💙

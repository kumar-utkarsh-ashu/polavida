import os
import re
import unittest
from html.parser import HTMLParser

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

class TestPolavidaFixes(unittest.TestCase):

    def read_file(self, rel_path):
        with open(os.path.join(BASE_DIR, rel_path), "r", encoding="utf-8") as f:
            return f.read()

    # ---------------------------------------------------------
    # 1. CSS & Button Hover Behavior
    # ---------------------------------------------------------
    def test_css_button_hover_and_contrast(self):
        css = self.read_file("assets/css/style.css")
        
        # 1. Booking summary btn-ghost contrast in Design B
        self.assertIn("[data-skin=b] .summary .btn-ghost", css,
                      "CSS should have contrasting styles for .btn-ghost inside .summary in skin B")
        self.assertIn("[data-skin=b] .summary .btn-ghost:hover", css,
                      "CSS should have hover style for .btn-ghost inside .summary in skin B")

        # 2. Consistent button hover colors
        self.assertIn(".btn-primary:hover", css)
        self.assertIn(".btn-ghost:hover", css)
        
        # Ensure Design B buttons have explicit hover color changes
        self.assertIn("[data-skin=b] body.has-hero .site-header:not(.scrolled) .btn-cta:hover", css,
                      "Header CTA button in skin B should have a defined hover color")
        self.assertIn("[data-skin=b] .cta .btn-primary:hover", css,
                      "CTA section btn-primary in skin B should have a defined hover color")
        
        # 3. no-frame utility to remove outline in skin B
        self.assertIn(".no-frame::before", css,
                      "CSS should provide a way to remove the outline frame in skin B")

    # ---------------------------------------------------------
    # 2. Event Calendar Page (events.html)
    # ---------------------------------------------------------
    def test_events_page(self):
        html = self.read_file("events.html")
        
        # Point 1: Remove inconsistent icons from all event cards
        self.assertNotIn('class="mini-medal"', html,
                         "Inconsistent mini-medal icons should be removed from all event cards")
        
        # Point 2: Incorporate mandala icons in background with safe positioning
        self.assertIn('href="#i-mandala"', html,
                      "events.html should incorporate mandala background SVGs (#i-mandala)")
        self.assertIn('position:absolute', html,
                      "Background SVGs must have inline position:absolute safety styles so they never break document flow")

    # ---------------------------------------------------------
    # 3. Booking Page (booking.html)
    # ---------------------------------------------------------
    def test_booking_page(self):
        html = self.read_file("booking.html")
        
        # Point 1 (A&B): Add an image in the hero
        self.assertIn('<div class="hero-media"', html,
                      "booking.html should have a hero-media container")
        self.assertTrue('detail_hero' in html or 'sunset' in html or 'yurt_land' in html,
                        "booking.html should contain a high quality hero image")
        
        # Point 2 (A&B): Incorporate mandala icons in background
        self.assertIn('href="#i-mandala"', html,
                      "booking.html should incorporate mandala background SVGs")

    # ---------------------------------------------------------
    # 4. Training Page (training.html)
    # ---------------------------------------------------------
    def test_training_page(self):
        html = self.read_file("training.html")
        
        # Point 1: Replace placeholder content
        self.assertNotIn("[Intro paragraph:", html, "Intro placeholder should be replaced")
        self.assertNotIn("[What this introduction covers", html, "Foundations placeholder should be replaced")
        self.assertNotIn("[Profile 1", html, "Profile placeholders should be replaced")
        
        # Point 2: Hero image replaced (training_hero.webp overused)
        self.assertNotIn('src="assets/img/training_hero.webp"', html,
                         "training_hero.webp is overused and should be replaced in hero")
        
        # Point 3: Include Sri Yantra symbols
        self.assertIn('href="#i-yantra"', html, "training.html should include Sri Yantra symbols")
        
        # Point 4: Prices should NOT be listed on this page
        self.assertNotIn('€600', html, "Prices should be removed from Learn One-to-One table")
        self.assertNotIn('€950', html, "Prices should be removed from Learn One-to-One table")
        self.assertNotIn('€2,000', html, "Prices should be removed from Learn One-to-One table")
        self.assertNotIn('€80 per hour', html, "Mentoring price should be removed")
        
        # Point 5 & 6: Replace image from Learn One-to-One section & remove outline in skin B
        learn_section_match = re.search(r'id="private".*?</section>', html, re.DOTALL)
        self.assertTrue(learn_section_match, "Learn One-to-One / private section must exist")
        learn_section = learn_section_match.group(0)
        self.assertNotIn('about_teach.webp', learn_section, "Learn One-to-One image should be replaced")
        self.assertIn('no-frame', learn_section, "Learn One-to-One image should have no-frame class to remove outline")
        
        # Point 7: Diverse comments in In Their Words section
        words_section_match = re.search(r'In Their Words.*?</div>\s*</div>\s*</section>', html, re.DOTALL)
        self.assertTrue(words_section_match, "In Their Words section must exist")
        words_section = words_section_match.group(0)
        self.assertIn('personal growth', words_section.lower())
        
        # Point 8: More copy in Your Path section
        self.assertIn('From Foundations to Therapy', html)
        path_section_match = re.search(r'id="path".*?class="path"', html, re.DOTALL)
        self.assertTrue(path_section_match)
        self.assertIn('<p', path_section_match.group(0), "Your Path section should have introductory copy paragraph")

    # ---------------------------------------------------------
    # 5. Retreats & Workshops Page (retreats.html)
    # ---------------------------------------------------------
    def test_retreats_page(self):
        html = self.read_file("retreats.html")
        
        # Point 1: No subpages in nav for Retreats & Workshops (direct link)
        self.assertNotIn('All Retreats &amp; Workshops →', html,
                         "Nav should not have subpage dropdown for Retreats & Workshops")
        self.assertIn('<a href="retreats.html">Retreats &amp; Workshops</a>', html,
                      "Nav should link directly to retreats.html")
        
        # Point 2: Subtext under Four Ways to Step Out of Daily Life
        four_ways_match = re.search(r'Four Ways to Step Out of Daily Life.*?</div>\s*<div class="cards', html, re.DOTALL)
        self.assertTrue(four_ways_match)
        self.assertIn('<p', four_ways_match.group(0), "Four Ways section should have subtext")
        
        # Point 3: Replace A Day on Retreat with Transformative Outcomes + Video
        self.assertNotIn('A Day on Retreat', html, "A Day on Retreat should be replaced")
        self.assertNotIn('[Example daily rhythm]', html, "Example daily rhythm should be replaced")
        self.assertIn('Outcome', html, "Should have outcomes section")
        self.assertIn('video', html.lower(), "Outcomes section should feature a video")
        
        # Point 4: More copy in Moments from Past Retreats / Gallery
        gallery_header_match = re.search(r'Moments from Past Retreats.*?<div class="gallery"', html, re.DOTALL)
        self.assertTrue(gallery_header_match)
        self.assertIn('<p', gallery_header_match.group(0), "Moments from Past Retreats gallery should have descriptive copy")
        
        # Point 5: Sri Yantra symbols
        self.assertIn('href="#i-yantra"', html, "retreats.html should include Sri Yantra symbols")

    # ---------------------------------------------------------
    # 6. Tantra & Coaching Page (tantra-coaching.html)
    # ---------------------------------------------------------
    def test_tantra_coaching_page(self):
        html = self.read_file("tantra-coaching.html")
        
        # Point 1 & 2: No page called "All Tantra & Coaching", opens on nav click
        self.assertNotIn('All Tantra &amp; Coaching →', html,
                         "All Tantra & Coaching link should be removed from nav")
        
        # Point 1 (B): Improved image positioning in hero
        self.assertIn('--fp:75%35%', html.replace(' ', ''),
                      "Hero focal point should be adjusted to frame Pola and client gracefully")
        
        # Point 2 (A&B): Sri Yantra symbols
        self.assertIn('href="#i-yantra"', html, "tantra-coaching.html should include Sri Yantra symbols")
        
        # Point 3 & 5: Replace overused images and remove outline
        self.assertNotIn('src="assets/img/tantra_room.webp"', html,
                         "tantra_room.webp is overused and should be replaced with card_massage.webp")
        self.assertIn('card_massage.webp', html)
        self.assertIn('no-frame', html, "Sections should have no-frame to remove awkward outline in skin B")
        
        # Point 4: Replace placeholder texts
        self.assertNotIn('[Your principles: consent', html, "Safety consent placeholder should be replaced")
        
        # Point 5 (A) / 6 (B): Remove FAQ
        self.assertNotIn('class="faq"', html, "FAQ section should be removed from tantra-coaching.html")
        
        # Point 6 (A) / 7 (B): More convincing copy in Safe Space for Deep Transformation
        self.assertIn('A Safe Space for Deep Transformation', html)
        # Check that 01, 02, 03, 04 have rich multi-sentence text
        four_pillars_match = re.search(r'A Safe Space for Deep Transformation.*?</div>\s*</div>\s*</section>', html, re.DOTALL)
        self.assertTrue(four_pillars_match)
        four_pillars = four_pillars_match.group(0)
        self.assertGreater(len(four_pillars), 600, "Pillars section should have expanded, convincing copy")

if __name__ == "__main__":
    unittest.main()

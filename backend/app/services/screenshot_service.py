
import uuid
from pathlib import Path

from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeoutError


SCREENSHOT_DIR = Path(__file__).resolve().parents[2] / "screenshots"


def capture_screenshot(url: str) -> str:
    SCREENSHOT_DIR.mkdir(parents=True, exist_ok=True)

    filename = f"{uuid.uuid4()}.png"
    screenshot_path = SCREENSHOT_DIR / filename

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)

        try:
            page = browser.new_page(
                viewport={"width": 1366, "height": 768}
            )

            # Wait only until navigation begins, not for every page resource.
            page.goto(
                url,
                wait_until="commit",
                timeout=60000
            )

            # Give the page time to render its visible content.
            try:
                page.wait_for_load_state(
                    "domcontentloaded",
                    timeout=10000
                )
            except PlaywrightTimeoutError:
                print("DOM content loading timed out; capturing current page.")

            page.wait_for_timeout(3000)

            page.screenshot(
                path=str(screenshot_path),
                full_page=True
            )

        finally:
            browser.close()

    return f"screenshots/{filename}"

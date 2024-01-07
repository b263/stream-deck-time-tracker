import { Icons } from "./icons";

describe("Icons", () => {
  test("getPlayIcon() should return the correct SVG", () => {
    const playIcon = Icons.get("play")!;
    const svg = playIcon({ workedToday: "0:00" });
    expect(svg).toContain(
      '<text x="12" y="4" text-anchor="middle" font-size="4px" fill="white">0:00</text>'
    );
  });

  test("getPauseIcon() should return the correct SVG when sum and cur are different", () => {
    const pauseIcon = Icons.get("pause")!;
    const svg = pauseIcon({ sum: "1:00", cur: "0:30" });
    expect(svg).toContain(
      '<text x="6" y="4" text-anchor="middle" font-size="4px" fill="white">1:00</text>'
    );
    expect(svg).toContain(
      '<text x="18" y="4" text-anchor="middle" font-size="4px" fill="white">0:30</text>'
    );
  });

  test("getPauseIcon() should return the correct SVG when sum and cur are the same", () => {
    const pauseIcon = Icons.get("pause")!;
    const svg = pauseIcon({ sum: "1:00", cur: "1:00" });
    expect(svg).toContain(
      '<text x="12" y="4" text-anchor="middle" font-size="4px" fill="white">1:00</text>'
    );
  });
});

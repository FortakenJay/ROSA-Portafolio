import { ImageResponse } from "next/og";

export const alt = "Rosa. Illustration and project reels. Sample portfolio in a cute gothic lolita mood.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          background: "#f8f7ed",
          color: "#050316",
          padding: "72px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", width: 560 }}>
          <div style={{ fontSize: 96, lineHeight: 1 }}>Rosa</div>
          <div
            style={{
              marginTop: 28,
              width: 160,
              height: 8,
              background: "#f0a8b0",
            }}
          />
          <div style={{ marginTop: 28, fontSize: 32, lineHeight: 1.35 }}>
            Illustration and project reels. Sample portfolio in a cute gothic lolita mood.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            marginLeft: 48,
            border: "10px solid #050316",
            padding: 14,
          }}
        >
          <div
            style={{
              width: 420,
              height: 420,
              background: "#70913b",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              border: "8px solid #050316",
            }}
          >
            <div
              style={{
                display: "flex",
                width: 300,
                height: 250,
                borderTop: "18px solid #f0a8b0",
                borderLeft: "18px solid #f0a8b0",
                borderRight: "18px solid #f0a8b0",
                borderTopLeftRadius: 150,
                borderTopRightRadius: 150,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  background: "#da253a",
                  marginTop: 40,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}

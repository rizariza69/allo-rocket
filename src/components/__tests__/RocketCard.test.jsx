import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import RocketCard from "../RocketCard";

const dummyRocket = {
  id: "1",
  name: "Falcon 9",
  description: "Reusable rocket for multiple launches and landings.",
  flickr_images: ["https://via.placeholder.com/300"],
};

describe("RocketCard Component", () => {
  it("should render rocket name and image", () => {
    render(
      <BrowserRouter>
        <RocketCard rocket={dummyRocket} />
      </BrowserRouter>
    );

    expect(screen.getByText("Falcon 9")).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute(
      "src",
      dummyRocket.flickr_images[0]
    );
  });

  it("should show rocket description (shortened)", () => {
    render(
      <BrowserRouter>
        <RocketCard rocket={dummyRocket} />
      </BrowserRouter>
    );

    expect(screen.getByText(/Reusable rocket/i)).toBeInTheDocument();
  });
});

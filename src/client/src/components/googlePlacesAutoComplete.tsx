/// <reference types="@types/google.maps" />
import React, { useEffect, useRef, useState } from "react";

interface GooglePlacesAutoCompleteProps {
  onPlaceSelect: (place: google.maps.places.PlaceResult) => void;
  placeholder?: string;
  className?: string;
  types?: string[];
  bounds?: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral;
  componentRestrictions?: google.maps.places.ComponentRestrictions;
  fields?: string[];
  strictBounds?: boolean;
  currentLocation?: { lat: number; lng: number };
  locationRadius?: number; // radius in meters for location biasing
  disabled?: boolean;
  defaultValue?: string;
}

const GooglePlacesAutoComplete: React.FC<GooglePlacesAutoCompleteProps> = ({
  onPlaceSelect,
  placeholder = "Search for a place...",
  className = "",
  types,
  bounds,
  componentRestrictions,
  fields = [
    "address_components",
    "formatted_address",
    "geometry",
    "name",
    "place_id",
  ],
  strictBounds = false,
  currentLocation,
  locationRadius = 50000, // 50km default
  disabled = false,
  defaultValue = "",
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [inputValue, setInputValue] = useState(defaultValue);

  useEffect(() => {
    if (!inputRef.current) return;

    // Check if Google Maps API is loaded
    if (!window.google?.maps?.places) {
      console.error("Google Maps JavaScript API not loaded");
      return;
    }

    // Build autocomplete options
    const options: google.maps.places.AutocompleteOptions = {
      fields,
      strictBounds,
    };

    // Add types if specified
    if (types && types.length > 0) {
      options.types = types;
    }

    // Add component restrictions if specified (e.g., country)
    if (componentRestrictions) {
      options.componentRestrictions = componentRestrictions;
    }

    // Add bounds for location biasing
    if (bounds) {
      options.bounds = bounds;
    } else if (currentLocation) {
      // Create bounds from current location and radius
      const circle = new google.maps.Circle({
        center: currentLocation,
        radius: locationRadius,
      });
      options.bounds = circle.getBounds() || undefined;
    }

    // Initialize Autocomplete
    const autocomplete = new google.maps.places.Autocomplete(
      inputRef.current,
      options
    );

    autocompleteRef.current = autocomplete;

    // Add place_changed listener
    const listener = autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();

      if (!place.geometry) {
        console.error("No details available for input:", place.name);
        return;
      }

      onPlaceSelect(place);
    });

    // Cleanup
    return () => {
      if (listener) {
        google.maps.event.removeListener(listener);
      }
    };
  }, [
    types,
    bounds,
    componentRestrictions,
    fields,
    strictBounds,
    currentLocation,
    locationRadius,
    onPlaceSelect,
  ]);

  // Update autocomplete options when props change
  useEffect(() => {
    if (!autocompleteRef.current) return;

    // Update bounds if they change
    if (bounds) {
      autocompleteRef.current.setBounds(bounds);
    } else if (currentLocation) {
      const circle = new google.maps.Circle({
        center: currentLocation,
        radius: locationRadius,
      });
      const newBounds = circle.getBounds();
      if (newBounds) {
        autocompleteRef.current.setBounds(newBounds);
      }
    }

    // Update component restrictions
    if (componentRestrictions) {
      autocompleteRef.current.setComponentRestrictions(componentRestrictions);
    }

    // Update types
    if (types) {
      autocompleteRef.current.setTypes(types);
    }
  }, [bounds, currentLocation, locationRadius, componentRestrictions, types]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleClear = () => {
    setInputValue("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        disabled={disabled}
        className={`input input-bordered w-full ${className}`}
      />
      {inputValue && !disabled && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          aria-label="Clear input"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default GooglePlacesAutoComplete;

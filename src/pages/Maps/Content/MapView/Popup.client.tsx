import type { Map as LeafletMap, Popup as LeafletPopupType } from 'leaflet';
import { Point } from 'leaflet';
import { PinProfile } from 'oa-components';
import type { ILatLng, MapPin } from 'oa-shared';
import React, { useEffect, useRef } from 'react';
import { Popup as LeafletPopup } from 'react-leaflet';

import './popup.css';

interface IProps {
  activePin: MapPin;
  mapRef: React.RefObject<LeafletMap | null>;
  customPosition?: ILatLng;
}

export const Popup = (props: IProps) => {
  const leafletRef = useRef<LeafletPopupType>(null);
  const { mapRef, customPosition } = props;

  useEffect(() => {
    openPopup();
  }, [props]);

  // HACK - as popup is created dynamically want to be able to trigger
  // open on props change
  const openPopup = () => {
    if (leafletRef.current && mapRef.current) {
      leafletRef.current.openOn(mapRef.current);
    }
  };

  if (!props.activePin?.lat) {
    return null;
  }

  return (
    <LeafletPopup
      ref={leafletRef}
      position={customPosition ? customPosition : [props.activePin.lat, props.activePin.lng]}
      offset={new Point(2, -10)}
      closeOnClick={false}
      closeOnEscapeKey={false}
      closeButton={false}
      minWidth={250}
      maxWidth={300}
      autoPan={false}
    >
      <PinProfile item={props.activePin} />
    </LeafletPopup>
  );
};

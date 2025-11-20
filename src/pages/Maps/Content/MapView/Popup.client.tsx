import React, { useEffect, useRef } from 'react';
import { Popup as LeafletPopup } from 'react-leaflet';
import { Point } from 'leaflet';
import { PinProfile } from 'oa-components';

import type { ILatLng, MapPin } from 'oa-shared';
import type { Map } from 'react-leaflet';

import './popup.css';

interface IProps {
  activePin: MapPin;
  mapRef: React.RefObject<Map>;
  onClose?: () => void;
  customPosition?: ILatLng;
}

export const Popup = (props: IProps) => {
  const leafletRef = useRef<LeafletPopup>(null);
  const { mapRef, onClose, customPosition } = props;

  useEffect(() => {
    openPopup();
  }, [props]);

  // HACK - as popup is created dynamically want to be able to trigger
  // open on props change
  const openPopup = () => {
    if (leafletRef.current && mapRef.current) {
      leafletRef.current.leafletElement.openOn(mapRef.current!.leafletElement);
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
      {onClose && <PinProfile item={props.activePin} onClose={onClose} />}
    </LeafletPopup>
  );
};

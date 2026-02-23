export type PlaceCategoryLevel = {
  category_id: string;
  name: string;
};

export type PlaceCategory = {
  level1: PlaceCategoryLevel;
  level2: PlaceCategoryLevel;
  level3: PlaceCategoryLevel;
  primary_type: PlaceCategoryLevel | null;
};

export type PlacePoint = {
  latitude: number;
  longitude: number;
};

export type PlaceResponse = {
  place_id: string;
  google_place_id: string;
  name: string;
  address: string;
  category: PlaceCategory;
  google_maps_uri: string;
  photos: string[];
  point: PlacePoint;
};

/**
 * 장소 검색 결과 아이템
 * GET /places/search
 * primary_type은 string으로 반환
 */
export type PlaceSearchItem = {
  place_id: string;
  google_place_id: string;
  name: string;
  address: string;
  primary_type?: string | null;
  category: {
    level1: PlaceCategoryLevel;
    level2: PlaceCategoryLevel;
    level3: PlaceCategoryLevel;
  };
  google_maps_uri: string;
  photos: string[];
  point: PlacePoint;
};

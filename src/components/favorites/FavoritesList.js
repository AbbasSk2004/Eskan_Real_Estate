import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getImageUrl } from '../../utils/imageUtils';
import propertyService from '../../services/propertyService';
import LoadingSpinner from '../common/LoadingSpinner';
import { useToast } from '../../hooks/useToast';

const FavoritesList = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const toast = useToast();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const data = await propertyService.getFavorites();
        setFavorites(data);
      } catch (error) {
        console.error('Error fetching favorites:', error);
        toast.error('Failed to load favorites');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchFavorites();
    }
  }, [user, toast]);

  const handleRemoveFavorite = async (propertyId) => {
    try {
      await propertyService.toggleFavorite(propertyId);
      setFavorites(prev => prev.filter(fav => fav.property_id !== propertyId));
      toast.success('Property removed from favorites');
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('Failed to remove from favorites');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <div className="favorites-empty">
        <h3>Please log in to view your favorites</h3>
        <Link to="/login" className="btn btn-primary">
          Log In
        </Link>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="favorites-empty">
        <h3>No favorites yet</h3>
        <p>Start browsing properties and add them to your favorites!</p>
        <Link to="/properties" className="btn btn-primary">
          Browse Properties
        </Link>
      </div>
    );
  }

  return (
    <div className="favorites-list">
      <h2>My Favorites</h2>
      <div className="property-grid">
        {favorites.map(favorite => (
          <div key={favorite.property_id} className="property-card">
            <Link to={`/properties/${favorite.property_id}`}>
              <div className="property-image">
                <img src={getImageUrl(favorite.property.main_image)} alt={favorite.property.title} />
                <div className="property-price">${favorite.property.price.toLocaleString()}</div>
              </div>
              <div className="property-info">
                <h4>{favorite.property.title}</h4>
                <p>{favorite.property.location}</p>
                <div className="property-features">
                  <span>{favorite.property.bedrooms} beds</span>
                  <span>{favorite.property.bathrooms} baths</span>
                  <span>{favorite.property.area} sqft</span>
                </div>
              </div>
            </Link>
            <button
              className="remove-favorite"
              onClick={() => handleRemoveFavorite(favorite.property_id)}
              aria-label="Remove from favorites"
            >
              <i className="fas fa-heart"></i>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesList;
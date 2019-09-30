import React, { Component } from 'react';
import './Home.css';
import Header from '../../common/Header/Header';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
    media: {
      height: 140
    },
});

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            restaurants: null,
            filteredRestaurants: [],
            loggedIn: sessionStorage.getItem("access-token") == null ? false : true
        }
    }

    componentWillMount() {

        // Get restaurant  list  
        let dataUserProfile = null;
        let xhrUserProfile = new XMLHttpRequest();
        let that = this;
        xhrUserProfile.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            const data = JSON.parse(this.responseText).restaurants;
            that.setState({
                restaurants : data,
                filteredRestaurants: data,
            }); 
        }
        });
        xhrUserProfile.open("GET",  this.props.baseUrl +  "restaurant");
        xhrUserProfile.setRequestHeader("Cache-Control", "no-cache");
        xhrUserProfile.send(dataUserProfile);
    }

    restaurantClickHandler = (restaurant_id, e) => {        
        this.props.history.push("/restaurant/"+restaurant_id);       
    };

    applyFilter = (e) => {
        // converting to lowercase to match with array
        const _searchText = (e.target.value).toLowerCase();
        let _restaurants = JSON.parse(JSON.stringify(this.state.restaurants));
        let _filteredRestaurants = [];
        if(_restaurants !== null && _restaurants.length > 0){
            _filteredRestaurants = _restaurants.filter((restaurant) => 
                 (restaurant.restaurant_name.toLowerCase()).indexOf(_searchText) > -1 
            );

            this.setState({
                filteredRestaurants: [..._filteredRestaurants]
            });
        }
    }


    render() {
        const { classes } = this.props;
        return (
            <div>
                <Header baseUrl={this.props.baseUrl} searchChangeHandler={this.applyFilter}/>
                <Container fixed style={{ 'margin':16}}>
                 {this.state.filteredRestaurants.length > 0 ? (
                    <Grid container spacing={3}>
                        {(this.state.filteredRestaurants ).map((restaurant, index) => (
                            <Grid item xs={6} sm={3} key={restaurant.id} >
                            <Card onClick={this.restaurantClickHandler.bind(this,restaurant.id)} >
                                <CardActionArea>
                                    <CardMedia
                                    className={classes.media}
                                    image={restaurant.photo_URL}
                                    title={restaurant.restaurant_name}
                                    />
                                    <CardContent>
                                    <Typography gutterBottom variant="h5" component="h2" style={{minHeight:70}}>
                                            {restaurant.restaurant_name}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" component="p" style={{marginBottom:8}}>
                                        {restaurant.categories}
                                    </Typography>
                                    <div className="card-footer">
                                        <div className="card-footer-rating">
                                             <i className="fa fa-star"></i><span style={{marginLeft:4}}>{restaurant.customer_rating} ({restaurant.number_customers_rated})</span> 
                                        </div>
                                        <div> 
                                        <i className="fa fa-inr"></i>{restaurant.average_price} for two
                                        </div>
                                    </div>
                                    
                                    </CardContent>
                                </CardActionArea>                      
                            </Card>
                            </Grid>  
                        ))}
                 </Grid> ) : (
                      <Typography variant="h6" color="textPrimary" component="h6" style={{marginBottom:8}}>
                          No restaurant with given name.
                      </Typography>
                 )  }             
                </Container>
            </div>
        )
    }

}

export default withStyles(styles)(Home);

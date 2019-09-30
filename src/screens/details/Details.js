import React, { Component } from 'react';
import './Details.css';
import Header from '../../common/Header/Header';
import Container from '@material-ui/core/Container';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import ShoppingCart  from '@material-ui/icons/ShoppingCart';
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Badge from '@material-ui/core/Badge';

const styles = theme => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      margin: 'auto',
      backgroundColor: 'lightgrey',
      boxShadow: 'none',
      borderRadius: 0,
    },
    image: {
      width: '100%',
      height: '100%',
    },
    img: {
      margin: 'auto',
      display: 'block',
      maxWidth: '100%',
      maxHeight: '100%',
    },
    close: {
        padding: theme.spacing(0.5),
    },
    margin: {
        margin: theme.spacing(2),
    },
    padding: {
        padding: theme.spacing(0, 2),
    },
  });

  class Details extends Component {
    constructor(props) {
        super(props);
        this.state = {
            snackBarOpen: false,
            snackBarMessage: '',
            restaurant: null,
            cartItems: { 
                            restaurant : null, 
                            itemList: [], 
                            totalPrice: 0, 
                            totalItemCount: 0
                        },
            loggedIn: sessionStorage.getItem("access-token") == null ? false : true
        }
    }

    componentWillMount() {
        const { match: { params } } = this.props;
        this.getRestaurantDetails(params.id);
    }

    getRestaurantDetails = (restaurant_id) => {  
        // Get restaurant details based on id
        let dataRestaurantDetails = null;
        let xhrUserProfile = new XMLHttpRequest();
        let that = this;
        let tempCartItems = this.state.cartItems;
        xhrUserProfile.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            const data = JSON.parse(this.responseText);
            that.setState({
                restaurant : data
            }); 
            tempCartItems.restaurant = data;
            that.setState({
                cartItems : tempCartItems
            }); 
        }
        });
        xhrUserProfile.open("GET",  this.props.baseUrl +  "restaurant/"+restaurant_id);
        xhrUserProfile.setRequestHeader("Cache-Control", "no-cache");
        xhrUserProfile.send(dataRestaurantDetails);
    };

    addToCart = (item, category) => {
        this.snackBarHandler("Item added to cart!");
        const addedCartItem = this.state.cartItems || { restaurant : this.state.restaurant, itemList: [], totalPrice: 0, totalItemCount: 0};
        let findIndex = null;

        // Finding item from List which already added
         let findItem = addedCartItem.itemList.find((cartItem, index) => {
             if(cartItem.item.id === item.id) {
                 findIndex = index;
                 return cartItem;
             }
             return undefined;
         });


         if(findItem !== undefined){
            findItem.quantity =  findItem.quantity + 1;
            findItem.totalItemPrice = findItem.totalItemPrice + item.price;
            addedCartItem.itemList[findIndex] = findItem;
            findIndex = null;
            addedCartItem.totalPrice = addedCartItem.totalPrice + item.price;
            addedCartItem.totalItemCount = addedCartItem.totalItemCount + 1;
         } else {

            const cartItem = {
                quantity : 1,
                categoryName: category.category_name,
                categoryId: category.id,
                item: item,
                totalItemPrice: item.price
            }
            addedCartItem.totalPrice = addedCartItem.totalPrice + item.price;
            addedCartItem.totalItemCount = addedCartItem.totalItemCount + 1;
            addedCartItem.itemList.push(cartItem);
        }
        this.setState({ cartItems: addedCartItem});      
    };


    removeAnItemFromCart = (removeCartItem, index) => {
       
        const addedCartItem = this.state.cartItems;
        // Finding item based on index
        let findItem = addedCartItem.itemList[index];
        findItem.quantity =  findItem.quantity - 1;
        findItem.totalItemPrice = findItem.totalItemPrice - findItem.item.price;
        addedCartItem.totalPrice = addedCartItem.totalPrice - findItem.item.price;
        addedCartItem.totalItemCount = addedCartItem.totalItemCount - 1; 

        if( findItem.quantity <= 0)  {
            addedCartItem.itemList.splice(index, 1);
            this.snackBarHandler("Item removed from cart!");
        }else{
            addedCartItem.itemList[index] = findItem;
            this.snackBarHandler("Item quantity descreased by 1!");
        }
        this.setState({ cartItems: addedCartItem});  

    }

    addAnItemFromCart = (addCartItem, index) => {
        this.snackBarHandler("Item quantity increased by 1!");
        const addedCartItem = this.state.cartItems;
        // Find item based on selected item index
        let findItem = addedCartItem.itemList[index];
         if(findItem !== undefined){
            findItem.quantity =  findItem.quantity + 1;
            findItem.totalItemPrice = findItem.totalItemPrice + findItem.item.price;
            addedCartItem.totalPrice = addedCartItem.totalPrice + findItem.item.price;
            addedCartItem.totalItemCount = addedCartItem.totalItemCount + 1;
         }     
         addedCartItem.itemList[index] = findItem;
         // Update cartItems in component state
        this.setState({ cartItems: addedCartItem});    
    };

    checkOutCart = (e) => {
        this.checkLoginUpdate();
        const addedCartItem = this.state.cartItems;
        //alert user to add item
        if( addedCartItem.itemList.length <=0 ){
            this.snackBarHandler("Please add an item to your cart!");
            return;
        }else {
            if(sessionStorage.getItem("access-token") === null){
                this.snackBarHandler("Please login first!");
                return;
            }else{
                // redirect to checkout page
                this.props.history.push({
                    pathname: "/checkout",
                    state: { cartDetail: this.state.cartItems}
                  })   
            }
        }
     };

    snackBarHandler = (message) => {
        this.setState({ snackBarOpen: false});
        this.setState({ snackBarMessage: message});
        this.setState({ snackBarOpen: true});
    }

    checkLoginUpdate = () => {
        this.setState({
            loggedIn: sessionStorage.getItem("access-token") == null ? false : true
        });
    }

    render() {
        let restaurant = this.state.restaurant;
        let cartItems = this.state.cartItems;
        const { classes } = this.props;
        return (
            <div className="details">
                <Header baseUrl={this.props.baseUrl} />              
                {restaurant !== null ? (
                    <div className={classes.root}>
                        <Paper className={classes.paper}>
                        <Grid container spacing={4}>
                            <Grid item xs={12} sm={3} container >
                            <ButtonBase className={classes.image} disableRipple={true}> 
                                <img className={classes.img} alt="complex" src={restaurant.photo_URL} />
                            </ButtonBase>
                            </Grid>
                            <Grid item xs={12} sm container >
                            <Grid item xs container direction="column" spacing={2} className="responsiveHeader">
                                <Grid item xs>
                                <Typography gutterBottom variant="h6">
                                    {restaurant.restaurant_name}
                                </Typography>
                                <Typography variant="body2" gutterBottom className="uppercase">
                                    {restaurant.address.locality}
                                </Typography>
                                {(restaurant.categories || []).map((category, index) => (
                                    <Typography variant="caption"  key={category.id} display="inline" >
                                        {category.category_name}{index < (restaurant.categories.length - 1) ? ', ' : ''}
                                    </Typography>
                                ))}
                                
                                </Grid>
                                <Grid item container spacing={4}>
                                    <Grid item xs={6} sm={2} >
                                        <Typography variant="body2" style={{ cursor: 'pointer', fontWeight: '500' }}>
                                        <i className="fa fa-star"></i><span style={{marginLeft:4}}>{restaurant.customer_rating}</span> 
                                        </Typography>
                                        <Typography variant="caption" style={{ cursor: 'pointer' }} className="uppercase smallFont">
                                            Average Rating by {restaurant.number_customers_rated} Customers
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6} sm={2}>
                                        <Typography variant="body2" style={{ cursor: 'pointer', fontWeight: '500' }}>
                                        <i className="fa fa-inr"></i><span style={{marginLeft:4}}>{restaurant.average_price}</span>
                                        </Typography>
                                        <Typography variant="caption" style={{ cursor: 'pointer' }} className="uppercase smallFont">
                                            Average cost for two people
                                        </Typography>
                                    </Grid>
                                
                                </Grid>
                            </Grid>
                            </Grid>
                        </Grid>
                        </Paper>
                        <Container style={{marginTop: 20}}>
                            <Grid container spacing={2} justify="space-between">
                                <Grid item xs={12} sm={5}> 
                                    {(restaurant.categories || []).map((category, index) => (
                                                
                                        <div key={category.id} style={{marginBottom: 16}}>
                                            <Typography variant="caption"  gutterBottom className="uppercase" >
                                                {category.category_name}
                                            </Typography>
                                            <Divider style={{ marginBottom: 8}} />
                                            <Grid container spacing={2} direction="column" >
                                                {(category.item_list || []).map((item, index) => (
                                                    <Grid item xs container key={item.id} >
                                                        <Grid container spacing={2} direction="row" justify="space-between" alignItems="center">
                                                            <Grid item >
                                                                <Typography variant="caption"  gutterBottom className="capitalize">
                                                                    <i className={item.item_type !== 'VEG' ? 'fa fa-circle redColor' : 'fa fa-circle greenColor'} />
                                                                    <span style={{marginLeft:8}} >{item.item_name}</span>
                                                                </Typography>
                                                            </Grid> 
                                                            <Grid item >
                                                                <Typography variant="caption"  gutterBottom>
                                                                <i className="fa fa-inr"></i>
                                                                    <span>{item.price}</span>
                                                                    <IconButton aria-label="Add to cart"  onClick={this.addToCart.bind(this,item,category)} className="padding-4 margin-l-30">
                                                                        <AddIcon />
                                                                    </IconButton>
                                                                </Typography>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        </div>

                                    ))}
                                
                                </Grid>
                                <Grid item xs={12} sm={5}>
                                    <Card className={classes.card}>
                                        <CardContent>
                                            <Badge className={classes.margin} badgeContent= {cartItems.totalItemCount === 0 ? '0' : cartItems.totalItemCount } color="primary">
                                                 <ShoppingCart />
                                            </Badge> <Typography className={classes.title} display="inline" variant="h6">My Cart </Typography>
                                            {(cartItems.itemList || []).map((cartItem, index) => (
                                                    <Grid item xs container key={cartItem.item.id} >
                                                        <Grid container spacing={2} direction="row" justify="space-between" alignItems="center">
                                                            <Grid item >
                                                                <Typography variant="caption"  gutterBottom className="capitalize">
                                                                    <i className={cartItem.item.item_type !== 'VEG' ? 'fa fa-stop-circle-o redColor' : 'fa fa-stop-circle-o greenColor'} />
                                                                    <span style={{marginLeft:8}} >{cartItem.item.item_name}</span>
                                                                </Typography>
                                                            </Grid> 
                                                            <Grid item >
                                                                <Typography variant="caption"  gutterBottom>
                                                                    <IconButton aria-label="Remove Item" className="padding-4 bold m-r-4" onClick={this.removeAnItemFromCart.bind(this, cartItem, index)}>
                                                                        <RemoveIcon  style={{fontSize: 16, fill: 'black'}} />
                                                                    </IconButton>
                                                                    <Typography variant="body" className="bold">{cartItem.quantity}</Typography> 
                                                                    <IconButton aria-label="Add Item" className="padding-4 bold m-l-4" onClick={this.addAnItemFromCart.bind(this, cartItem, index)}>
                                                                        <AddIcon style={{fontSize: 16, fill: 'black'}}/>
                                                                    </IconButton>                                                                    
                                                                </Typography>
                                                                <Typography variant="caption"  gutterBottom className="margin-l-30">
                                                                    <i className="fa fa-inr"></i>
                                                                    <span>{cartItem.totalItemPrice}</span>                                                                    
                                                                </Typography>
                                                            </Grid>                                                            
                                                        </Grid>
                                                    </Grid>
                                                ))}
                                                <Grid item xs container justify="space-between" style={{marginTop: 16}}>
                                                    <Grid item >
                                                        <Typography variant="caption"  gutterBottom className="bold">
                                                            Total Amount                                                                  
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item >
                                                        <Typography variant="caption"  gutterBottom className="bold">
                                                             <i className="fa fa-inr"></i>
                                                            {cartItems.totalPrice}                                                                  
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                        </CardContent>
                                        <CardActions>
                                            <Button variant="contained" color="primary" style={{width:'100%'}} onClick={this.checkOutCart.bind(this)}>
                                                CHECKOUT
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            </Grid>


                            <Snackbar 
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }} 
                                open={this.state.snackBarOpen} 
                                autoHideDuration={6000}  
                                onClose={() => this.setState({ snackBarOpen: false })}
                                ContentProps={{
                                    'aria-describedby': 'message-id',
                                }}
                                message={<span id="message-id">{this.state.snackBarMessage}</span>}
                                action={[
                                    <IconButton
                                        key="close"
                                        aria-label="Close"
                                        color="inherit"
                                        className={classes.close}
                                        onClick={() => this.setState({ snackBarOpen: false })}
                                        >
                                        <CloseIcon />
                                    </IconButton>
                                ]}
                            />

                        </Container>


                    </div>
                ) : ""}
                
            </div>
        )
    }
}

Details.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Details);
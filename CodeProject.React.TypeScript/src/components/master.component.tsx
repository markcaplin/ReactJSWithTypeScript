import * as React from 'react';
import Loadable from 'react-loadable';

import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';

import HomeComponent from './home.component';
import AboutComponent from './about.component';
import LoginComponent from './login.component';
import RegisterComponent from './register.component';

import AlertComponent from './alert.component';
import ProgressBarComponent from './progressbar.component';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Grid from '@material-ui/core/Grid';

import { BrowserRouter, Redirect } from 'react-router-dom';
import { Store } from 'redux';
import { IApplicationState } from '../store/store';
import { IUserState } from '../store/types';
import { connect } from 'react-redux';
import { updateUser, logoutUser } from '../store/actions';
import { UserInformationViewModel } from '../viewmodels/user-information.viewmodel';
import { MasterComponentState } from './master.component.state';
import { Route, Link, Switch } from 'react-router-dom';
import { MenuItem } from '../viewmodels/menu.viewmodel';
import { RouteProps } from 'react-router';
import { RouteComponentProps } from 'react-router-dom';

import '../index.css';
import './master.component.css';
import 'typeface-roboto';

const authorize = {
    authenticate() {
        let isAuthenicated = false;
        let token: any = localStorage.getItem('ReactToken');
        if (token == null || token === undefined) {
            isAuthenicated = false;
        } else {
            let jwt: any = JSON.parse(atob(token.split('.')[1]));
            isAuthenicated = true;
            let currentTime: number = Date.now() / 1000;
            if (jwt.exp < currentTime) {
                isAuthenicated = false;
            }
        }
        return isAuthenicated;
    }
};

const PrivateRoute: React.SFC<RouteProps> = ({ component: Component, ...rest }) => {
    if (authorize.authenticate() === false) {
        return <Redirect to="/login" />;
    }
    if (!Component) {
        return null;
    }
    return <Route {...rest} render={(props: RouteComponentProps<{}>) => <Component {...props} />} />;
};

const ProductInquiryComponent = Loadable({
    loader: () => import(/* webpackChunkName: "products" */ './productinquiry.component'),
    loading: () => null
});

const ProductDetailComponent = Loadable({
    loader: () => import(/* webpackChunkName: "products" */ './productdetail.component'),
    loading: () => null
});

const CheckoutComponent = Loadable({
    loader: () => import(/* webpackChunkName: "orders" */ './checkout.component'),
    loading: () => null
});

const OrderInquiryComponent = Loadable({
    loader: () => import(/* webpackChunkName: "orders" */ './orderinquiry.component'),
    loading: () => null
});

const ShoppingCartComponent = Loadable({
    loader: () => import(/* webpackChunkName: "orders" */ './shoppingcart.component'),
    loading: () => null
});

interface IProps {
    userInformation: UserInformationViewModel;
    reduxStore: Store;
}

type MasterComponentProps = IProps;

const masterComponentState = new MasterComponentState();
type State = Readonly<typeof masterComponentState>;

class MasterComponent extends React.Component<MasterComponentProps> {
    readonly state: State = masterComponentState;
    unsubscribe: any;
    classes: any;
    menuItems: Array<MenuItem>;

    constructor(props: MasterComponentProps) {
        super(props);

        this.menuItems = [
            {
                text: 'Home',
                route: '/',
                display: true,
                requiresAuthenication: false,
                alwaysShow: true
            },
            {
                text: 'About',
                route: '/about',
                display: true,
                requiresAuthenication: false,
                alwaysShow: true
            },
            {
                text: 'Product Inquiry',
                route: '/productInquiry',
                display: false,
                requiresAuthenication: true,
                alwaysShow: false
            },
            {
                text: 'Orders',
                route: '/orders',
                display: false,
                requiresAuthenication: true,
                alwaysShow: false
            },
            {
                text: 'ShoppingCart',
                route: '/shoppingCart',
                display: false,
                requiresAuthenication: true,
                alwaysShow: false
            },
            {
                text: 'Login',
                route: '/login',
                display: true,
                requiresAuthenication: false,
                alwaysShow: false
            },
            {
                text: 'Register',
                route: '/register',
                display: true,
                requiresAuthenication: false,
                alwaysShow: false
            },
            {
                text: 'Logout',
                route: '/logout',
                display: false,
                requiresAuthenication: true,
                alwaysShow: false
            }
        ];
    }

    componentDidMount() {
        let userInformation = this.props.userInformation;
        this.setState({ ...userInformation });
        this.unsubscribe = this.props.reduxStore.subscribe(this.handleChange.bind(this));
        this.updateMenuItems(userInformation);
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    logout = () => {
        let thisComponent: any = this;
        thisComponent.props.logoutUser();
    }

    handleMenuClick = (event: any) => {
        let openClose = this.state.openDrawer;
        if (openClose === true) {
            openClose = false;
        } else if (openClose === false) {
            openClose = true;
        }

        this.setState({ openDrawer: openClose });
    };

    handleChange() {
        let userInformation: IUserState = this.props.reduxStore.getState().userInformation.userInformation;

        if (userInformation === undefined) {
            return;
        }

        if (userInformation.authenicationCounter === undefined) {
            return;
        }

        if (userInformation.authenicationCounter === this.state.authenicationCounter) {
            return;
        }

        this.setState({
            authenicationCounter: userInformation.authenicationCounter
        });

        this.setState({ ...userInformation });

        this.updateMenuItems(userInformation);
    }

    updateMenuItems = (userInformation: UserInformationViewModel) => {
        this.menuItems.forEach(menu => {
            menu.display = true;
            if (menu.alwaysShow === false) {
                if (userInformation.isAuthenicated === false && menu.requiresAuthenication === true) {
                    menu.display = false;
                } else if (userInformation.isAuthenicated === true && menu.requiresAuthenication === false) {
                    menu.display = false;
                }
            }
        });
        let menuItemsToDisplay = this.menuItems.filter(x => x.display === true);
        this.setState({ menuItems: menuItemsToDisplay });
    };

    toggleDrawer = (openClose: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        this.setState({ openDrawer: openClose });
    };

    render() {
        return (
            <div>
                <BrowserRouter>
                    <AppBar position="static">
                        <Toolbar>
                            <Grid container spacing={1}>
                                <Grid item xs={12} sm={12} xl={6} md={6} lg={6}>
                                    <div className="menubutton">
                                        <IconButton aria-label="more" aria-controls="long-menu" aria-haspopup="true" onClick={this.handleMenuClick}>
                                            <MenuIcon style={{ color: 'white' }} />
                                        </IconButton>
                                    </div>
                                    <div
                                        style={{
                                            float: 'left',
                                            verticalAlign: 'middle',
                                            height: '40px',
                                            paddingTop: '10px'
                                        }}
                                    >
                                        <Typography variant="h6">Code Project - ReactJS</Typography>
                                    </div>
                                </Grid>
                            </Grid>

                            <div className="menubar">
                                <Grid container alignContent="flex-end" alignItems="flex-end">
                                    <Grid item xs={1} sm={1} md={6} lg={12} xl={12}>
                                        <div className={this.state.isAuthenicated ? 'hidden' : 'nothidden'}>
                                            <Typography variant="h6">
                                                <Link className="App-link" to="/login">
                                                    Login
                                                </Link>
                                                &nbsp;|&nbsp;
                                                <Link className="App-link" to="/register">
                                                    Register
                                                </Link>
                                                &nbsp;&nbsp;
                                            </Typography>
                                        </div>
                                        <div className={this.state.isAuthenicated ? 'nothidden' : 'hidden'}>
                                            <Typography variant="h6">
                                                <Link className="App-link" to="/login" onClick={this.logout}>
                                                    Logout
                                                </Link>
                                                &nbsp;&nbsp;&nbsp;&nbsp;
                                                <span className="App-link">
                                                    {this.state.firstName} {this.state.lastName}
                                                </span>
                                            </Typography>
                                        </div>
                                        <div className={this.state.isAuthenicated ? 'nothidden' : 'hidden'}>
                                            <Typography variant="h6">
                                                <Link className="App-link" to="/shoppingCart">
                                                    Shopping Cart
                                                </Link>
                                                &nbsp;|&nbsp;
                                                <Link className="App-link" to="/orders">
                                                    Orders
                                                </Link>
                                                &nbsp;|&nbsp;
                                                <Link className="App-link" to="/productInquiry">
                                                    Product Inquiry
                                                </Link>
                                                &nbsp;|&nbsp;
                                            </Typography>
                                        </div>
                                        <div className="nothidden">
                                            <Typography variant="h6">
                                                <Link className="App-link" to="/">
                                                    Home
                                                </Link>
                                                &nbsp;|&nbsp;
                                                <Link className="App-link" to="/about">
                                                    About
                                                </Link>
                                                &nbsp;|&nbsp;
                                            </Typography>
                                        </div>
                                    </Grid>
                                </Grid>
                            </div>
                        </Toolbar>
                    </AppBar>
                    <ProgressBarComponent reduxStore={this.props.reduxStore} />
                    <AlertComponent reduxStore={this.props.reduxStore} />
                    <Switch>
                        <Route exact path="/" component={HomeComponent} />
                        <Route exact path="/about" component={AboutComponent} />
                        <PrivateRoute exact path="/productdetail/:id" component={ProductDetailComponent} />
                        <Route exact path="/orders" component={OrderInquiryComponent} />
                        <PrivateRoute exact path="/shoppingCart" component={ShoppingCartComponent} />
                        <PrivateRoute exact path="/checkout" component={CheckoutComponent} />
                        <PrivateRoute path="/productInquiry" component={ProductInquiryComponent} />
                        <Route exact path="/login" component={LoginComponent} />
                        <Route exact path="/register" component={RegisterComponent} />
                    </Switch>

                    <Drawer open={this.state.openDrawer} onClose={this.toggleDrawer}>
                        <div style={{ width: '300px' }} role="presentation" onClick={this.toggleDrawer(false)} onKeyDown={this.toggleDrawer(false)}>
                            <div style={{ alignContent: 'right' }}>
                                <IconButton>
                                    <ChevronLeftIcon />
                                </IconButton>
                            </div>
                            <Divider />
                            <List>
                                {this.state.menuItems.map((item, index) => (
                                    <ListItem key={item.route}>
                                        <ListItemText>
                                            <Link style={{ color: 'black', textDecoration: 'none' }} to={item.route}>
                                                {item.text}
                                            </Link>
                                        </ListItemText>
                                    </ListItem>
                                ))}
                            </List>
                        </div>
                    </Drawer>
                </BrowserRouter>
            </div>
        );
    }
}

function mapStateToProps(state: IApplicationState) {
    return state.userInformation;
}

const mapDispatchToProps = {
    updateUser,
    logoutUser
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MasterComponent);

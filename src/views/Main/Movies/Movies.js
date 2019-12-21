import React, { Component } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Form,
  FormGroup,
  Input,
  ListGroup,
  ListGroupItem,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row
} from 'reactstrap';
import axios from 'axios';

const { backEndUrl } = require('../../../modules/api');

const loading_img = 'https://i.ibb.co/KDQpF1P/spinner-2.gif';

class Movies extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      autoResp: '',
      loading: true,
      loading2: true,
      fetchingData: false,
      fetchingData2: false,

      movie_id: null,
      alertDeleteMovie: false,

      openAddMovie: false,
      selectedProductionHouseId: 1,
      newMovie: '',
      newGenre: '',
      alertAddMovie: false,

      updateMovie: false,
      alertUpdateMovie: false,

      data: [],
      dataAll: [],
      phouse: [],
    };
  }


  componentDidMount() {

    document.title = 'Movies';

    this.interval = setInterval(() => {
      this.setState({ autoResp: 'auto' })
    }, 100);

    this.fetchDataAllMovies();
    this.fetchDataAllProductionHouse();
  }

  fetchDataAllMovies() {
    axios.get(backEndUrl + '/api/v1/movie/')
      .then((res) => this.setState({ data: res.data.movies, dataAll: res.data.movies, loading: false }))
      .catch((e) => {
        console.log(e)
      })
  }

  fetchDataAllProductionHouse() {
    axios.get(backEndUrl + '/api/v1/productionhouse/')
      .then((res) => this.setState({ phouse: res.data.productionHouse, selectedProductionHouseId: res.data.productionHouse[0].id, loading2: false }))
      .catch((e) => {
        console.log(e)
      })
  }

  fetchAddMovie() {
    this.setState({ fetchingData: true }, () => {
      let data = {
        "movie": this.state.newMovie,
        "genre": this.state.newGenre,
        "productionHouseId": this.state.selectedProductionHouseId
      };
      axios.post(backEndUrl + '/api/v1/movie/add', data)
        .then((res) => {
          this.fetchDataAllMovies();
          this.fetchDataAllProductionHouse();
          this.setState({ fetchingData: false })
        })
        .catch((e) => {
          console.log(e)
        })
    })
  }

  fetchUpdateMovie() {
    this.setState({ fetchingData: true }, () => {
      let data = {
        "movie": this.state.newMovie,
        "genre": this.state.newGenre,
        "productionHouseId": this.state.selectedProductionHouseId
      };
      axios.put(backEndUrl + '/api/v1/movie/update/' + this.state.movie_id, data)
        .then((res) => {
          this.fetchDataAllMovies();
          this.fetchDataAllProductionHouse();
          this.setState({ fetchingData: false })
        })
        .catch((e) => {
          console.log(e)
        })
    })
  }

  fetchDeleteMovie() {
    this.setState({ fetchingData2: true }, () => {
      axios.delete(backEndUrl + '/api/v1/movie/delete/' + this.state.movie_id)
        .then((res) => {
          this.fetchDataAllMovies();
          this.fetchDataAllProductionHouse();
          this.setState({ fetchingData2: false })
        })
        .catch((e) => {
          console.log(e)
        })
    })
  }

  render() {
    const { data, loading, loading2 } = this.state;

    if (loading || loading2) {
      return (<div className='d-flex justify-content-center align-items-center'><img src={loading_img} alt="loading" style={{ width: 50, height: 50 }} /></div>)
    }

    return (
      <div className="animated fadeIn" style={{ paddingBottom: 50 }}>
        <Card className="mb-0" style={{ marginTop: 30 }}>
          <CardHeader>
            <div>
              <div className='d-flex justify-content-between'>
                <div>
                  <Button color="primary" size="sm" onClick={() => this.setState({ openAddMovie: true })}>
                    <i className='fa fa-plus'></i>&nbsp;{window.innerWidth < 630 ? '' : 'Add Movie'}
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardBody>
            <ListGroup>
              <ListGroupItem>
                <Row className='d-flex justify-content-between'>
                  <div className='d-flex flex-row align-items-center' style={{ marginTop: window.innerWidth < 480 ? 10 : 0 }}>
                    <select class="form-control" id="selectstatus" style={{ width: 250 }} onChange={(e) => {
                      this.setState({
                        data: this.state.dataAll.filter(function (item) {
                          return item.productionHouseId === parseInt(e.target.value, 10);
                        })
                      })
                    }}>
                      {
                        this.state.phouse.map((p) =>
                          <option value={p.id}>{p.name}</option>
                        )
                      }
                    </select>
                    <Button size="sm" color="warning" style={{ marginLeft: 15 }} onClick={() => this.setState({ data: this.state.dataAll })}>Show All</Button>
                  </div>
                </Row>
              </ListGroupItem>
              {
                data
                  .map((item, i) =>
                    <ListGroupItem tag="button" style={{ paddingLeft: 30 }} action key={i}>
                      <Row className='d-flex justify-content-between align-items-center'>
                        <div className='d-flex flex-row align-items-center'>
                          <div style={{ marginLeft: 15 }}>
                            <h6 className="truncate" style={{ fontWeight: 'bold', width: window.innerWidth <= 350 ? 100 : window.innerWidth <= 700 ? 150 : 300 }}>{item.movie}</h6>
                            <div className="truncate" style={{ width: window.innerWidth <= 350 ? 100 : window.innerWidth <= 700 ? 150 : 300 }}>{item.genre}</div>
                          </div>
                        </div>
                        {
                          window.innerWidth >= 480 ?
                            <div className='d-flex flex-column align-items-end'>
                              <div className="d-flex flex-row justify-content-end">
                                <Button color="warning" size="sm" style={{ marginRight: 10 }} onClick={() => {
                                  this.setState({
                                    movie_id: item.id,
                                    newMovie: item.movie,
                                    newGenre: item.genre,
                                    selectedProductionHouseId: item.productionHouseId,
                                    updateMovie: true
                                  })
                                 }}>
                                  <i className='fa icon-pencil'></i>
                                </Button>
                                <Button color="danger" size="sm" onClick={() => this.setState({ alertDeleteMovie: true, movie_id: item.id })}>
                                  <i className='fa icon-trash'></i>
                                </Button>
                              </div>
                            </div>
                            :
                            null
                        }
                      </Row>
                    </ListGroupItem>
                  )
              }
            </ListGroup>
          </CardBody>
        </Card>


        <Modal isOpen={this.state.alertDeleteMovie} toggle={() => this.setState(prevState => ({ alertDeleteMovie: !prevState.alertDeleteMovie }))} >
          <ModalHeader toggle={() => this.setState(prevState => ({ alertDeleteMovie: !prevState.alertDeleteMovie }))}>
            Alert!
          </ModalHeader>
          <ModalBody>
            <p>Are you sure want delete this movie ?</p>
          </ModalBody>
          <ModalFooter>
            <Button type="submit" size="sm" color="primary" style={{ marginRight: 15 }} onClick={() => {
              this.fetchDeleteMovie();
              this.setState({ alertDeleteMovie: false })
            }}>Yes</Button>
            <Button color="danger" size="sm" onClick={() => this.setState({
              alertDeleteMovie: false
            })}>
              No
            </Button>
          </ModalFooter>
        </Modal>


        <Modal isOpen={this.state.openAddMovie} toggle={() => this.setState(prevState => ({ openAddMovie: !prevState.openAddMovie }))} >
          <ModalHeader toggle={() => this.setState(prevState => ({ openAddMovie: !prevState.openAddMovie }))}>
            Add Movie
          </ModalHeader>
          <ModalBody>
            <Form className="form-horizontal" style={{ marginTop: 20 }}>
              <FormGroup row>
                <Col xs="12" md="9">
                  <div className='d-flex flex-row align-items-center' style={{ marginTop: window.innerWidth < 480 ? 10 : 0 }}>
                    <select class="form-control" id="selectstatus" style={{ width: 250 }} onChange={(e) => {
                      this.setState({ selectedProductionHouseId: parseInt(e.target.value) })
                    }}>
                      {
                        this.state.phouse.map((p) =>
                          <option value={p.id}>{p.name}</option>
                        )
                      }
                    </select>
                  </div>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col xs="12" md="9">
                  <Input value={this.state.newMovie} type="text" id="text-input" name="text-input" placeholder="Enter New Movie" onChange={(e) =>
                    this.setState({ newMovie: e.target.value })
                  } />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col xs="12" md="9">
                  <Input value={this.state.newGenre} type="text" id="text-input" name="text-input" placeholder="Enter New Movie" onChange={(e) =>
                    this.setState({ newGenre: e.target.value })
                  } />
                </Col>
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <div className='d-flex justify-content-end'>
              <div className='d-flex flex-row'>
                <Button type="submit" size="sm" color="danger" style={{ marginRight: 15 }} onClick={() => this.setState({ openAddMovie: false })}>Cancel</Button>
                <Button type="submit" size="sm" color="success" style={{ marginRight: 15 }} onClick={() => {
                  if (this.state.newMovie !== '' && this.state.newGenre !== '') {
                    this.setState({ alertAddMovie: true })
                  } else {
                    alert('Please complete the form');
                  }
                }}><i className="fa fa-plus"></i> Add</Button>
              </div>
            </div>
          </ModalFooter>
        </Modal>
        <Modal isOpen={this.state.alertAddMovie} toggle={() => this.setState(prevState => ({ alertAddMovie: !prevState.alertAddMovie }))} >
          <ModalHeader toggle={() => this.setState(prevState => ({ alertAddMovie: !prevState.alertAddMovie }))}>
            Alert!
          </ModalHeader>
          <ModalBody>
            <p>Are you sure want add this movie ?</p>
          </ModalBody>
          <ModalFooter>
            <Button type="submit" size="sm" color="primary" style={{ marginRight: 15 }} onClick={() => {
              this.fetchAddMovie();
              this.setState({ openAddMovie: false, alertAddMovie: false })
            }}>Yes</Button>
            <Button color="danger" size="sm" onClick={() => this.setState({
              alertAddMovie: false
            })}>
              No
            </Button>
          </ModalFooter>
        </Modal>


        <Modal isOpen={this.state.updateMovie} toggle={() => this.setState(prevState => ({ updateMovie: !prevState.updateMovie }))} >
          <ModalHeader toggle={() => this.setState(prevState => ({ updateMovie: !prevState.updateMovie }))}>
            Update Movie
          </ModalHeader>
          <ModalBody>
            <Form className="form-horizontal" style={{ marginTop: 20 }}>
              <FormGroup row>
                <div className='d-flex flex-row align-items-center' style={{ marginTop: window.innerWidth < 480 ? 10 : 0 }}>
                  <select class="form-control" id="selectstatus" style={{ width: 250 }} onChange={(e) => {
                    this.setState({ selectedProductionHouseId: parseInt(e.target.value) })
                  }}>
                    {
                      this.state.phouse.map((p) =>
                        <option value={p.id}>{p.name}</option>
                      )
                    }
                  </select>
                </div>
              </FormGroup>
              <FormGroup row>
                <Col xs="12" md="9">
                  <Input value={this.state.newMovie} type="text" id="text-input" name="text-input" placeholder="Enter New Movie" onChange={(e) =>
                    this.setState({ newMovie: e.target.value })
                  } />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col xs="12" md="9">
                  <Input value={this.state.newGenre} type="text" id="text-input" name="text-input" placeholder="Enter New Movie" onChange={(e) =>
                    this.setState({ newGenre: e.target.value })
                  } />
                </Col>
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <div className='d-flex justify-content-end'>
              <div className='d-flex flex-row'>
                <Button type="submit" size="sm" color="danger" style={{ marginRight: 15 }} onClick={() => this.setState({ updateMovie: false })}>Cancel</Button>
                <Button type="submit" size="sm" color="success" onClick={() => {
                  if (this.state.newMovie !== '' && this.state.newGenre !== '') {
                    this.setState({ alertUpdateMovie: true })
                  } else {
                    alert('Please complete the form');
                  }
                }}>Change</Button>
              </div>
            </div>
          </ModalFooter>
        </Modal>
        <Modal isOpen={this.state.alertUpdateMovie} toggle={() => this.setState(prevState => ({ alertUpdateMovie: !prevState.alertUpdateMovie }))} >
          <ModalHeader toggle={() => this.setState(prevState => ({ alertUpdateMovie: !prevState.alertUpdateMovie }))}>
            Alert!
          </ModalHeader>
          <ModalBody>
            <p>Are you sure want update this movie ?</p>
          </ModalBody>
          <ModalFooter>
            <Button type="submit" size="sm" color="primary" style={{ marginRight: 15 }} onClick={() => {
              this.fetchUpdateMovie();
              this.setState({ updateMovie: false, alertUpdateMovie: false })
            }}>Yes</Button>
            <Button color="danger" size="sm" onClick={() => this.setState({
              alertUpdateMovie: false
            })}>
              No
            </Button>
          </ModalFooter>
        </Modal>


        <Modal isOpen={this.state.fetchingData} >
          <ModalBody>
            <div className='d-flex justify-content-center align-items-center'><img src={loading_img} alt="loading" style={{ width: 50, height: 50, marginRight: 15 }} />Uploading data...</div>
          </ModalBody>
        </Modal>
        <Modal isOpen={this.state.fetchingData2} >
          <ModalBody>
            <div className='d-flex justify-content-center align-items-center'><img src={loading_img} alt="loading" style={{ width: 50, height: 50, marginRight: 15 }} />Deleting data...</div>
          </ModalBody>
        </Modal>
      </div>

    );
  }
}

export default Movies;

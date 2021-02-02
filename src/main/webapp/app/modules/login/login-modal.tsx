import React from 'react';
import { translate, Translate } from 'react-jhipster';
import { Button, Form, Message, Modal } from 'semantic-ui-react';

export interface ILoginModalProps {
  showModal: boolean;
  loginError: boolean;
  handleLogin: Function;
  handleClose: Function;
}

class LoginModal extends React.Component<ILoginModalProps> {
  state = { username: '', password: '' };

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  handleSubmit = () => {
    const { username, password } = this.state;
    const { handleLogin } = this.props;
    handleLogin(username, password, false);
  };

  render() {
    const { loginError, handleClose } = this.props;

    return (
      // @ts-ignore
      <Modal size="tiny" onClose={handleClose} open={this.props.showModal}>
        <Modal.Header>
          <Translate contentKey="login.title">Sign in</Translate>
        </Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <Form error={loginError} onSubmit={this.handleSubmit}>
              <Form.Input
                fluid
                icon="user"
                iconPosition="left"
                name="username"
                placeholder={translate('global.form.username.placeholder')}
                required
                errorMessage="Username cannot be empty!"
                onChange={this.handleChange}
                autoFocus
              />
              <Form.Input
                fluid
                icon="lock"
                iconPosition="left"
                name="password"
                type="password"
                placeholder={translate('login.form.password.placeholder')}
                required
                errorMessage="Password cannot be empty!"
                onChange={this.handleChange}
              />
              <Message error size="mini" content={translate('login.messages.error.authentication')} />
              <Button primary type="submit" floated="right">
                <Translate contentKey="login.form.button">Sign in</Translate>
              </Button>
              {/* tslint:disable-next-line:jsx-no-lambda */}
              <Button secondary onClick={() => handleClose()} floated="right" tabIndex="1">
                <Translate contentKey="entity.action.cancel">Cancel</Translate>
              </Button>
            </Form>
          </Modal.Description>
        </Modal.Content>
      </Modal>
      /* <Modal isOpen={this.props.showModal} toggle={handleClose} backdrop="static" id="login-page" autoFocus={false}>
         <AvForm onSubmit={this.handleSubmit}>
           <ModalHeader id="login-title" toggle={handleClose}>
             <Translate contentKey="login.title">Sign in</Translate>
           </ModalHeader>
           <ModalBody>
             <Row>
               <Col md="12">
                 {loginError ? (
                   <Alert color="danger">
                     <Translate contentKey="login.messages.error.authentication">
                       <strong>Failed to sign in!</strong> Please check your credentials and try again.
                     </Translate>
                   </Alert>
                 ) : null}
               </Col>

             </Row>
             <div className="mt-1">&nbsp;</div>
             <Alert color="warning">
               <Link to="/reset/request">
                 <Translate contentKey="login.password.forgot">Did you forget your password?</Translate>
               </Link>
             </Alert>
             <Alert color="warning">
               <span>
                 <Translate contentKey="global.messages.info.register.noaccount">You don't have an account yet?</Translate>
               </span>{' '}
               <Link to="/register">
                 <Translate contentKey="global.messages.info.register.link">Register a new account</Translate>
               </Link>
             </Alert>
           </ModalBody>
           <ModalFooter>
             <Button color="secondary" onClick={handleClose} tabIndex="1">
               <Translate contentKey="entity.action.cancel">Cancel</Translate>
             </Button>{' '}
             <Button color="primary" type="submit">
               <Translate contentKey="login.form.button">Sign in</Translate>
             </Button>
           </ModalFooter>
         </AvForm>
       </Modal>*/
    );
  }
}

export default LoginModal;

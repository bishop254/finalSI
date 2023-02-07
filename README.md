1. We begin by creating a new Angular Project using the command below:
   ```bash
   ng new finalSI
	```

2. We then install Angular material and later updated it to version 14 along with Angular CLI and Angular Core.
   ```bash
   ng add @angular/material
   ng update @angular/material@14 @angular/cli@14 @angular/core@14
	```
	
3. We now have a good starting point for the project. We begin by setting up some github branches to allow us to divide our project into main/master, dev and feature branches. The feature branches will be a couple depending on what feature we are working on.
   ```bash
   git branch development
   git branch feature-<>
	```

We now work on the **development** branch and add boilerplate code for the Landing page, Navigation header and the Login page.

---

### Creating our nav-bar, a landing page and a login page
1. Using angular material, use the schematics feature to create two components and tune them to your needs.
   ```bash
   ng generate @angular/material:dashboard landing
   ng generate @angular/material:address-form login
   ng generate @angular/material:navigation nav
	```

2. We then allow our Angular app to know the various components using URL paths. We navigate to our *app.routing.module.ts* and add our new paths
```ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  { path: 'landing', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', pathMatch: 'full', component: LandingComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
```

3. Our Navigation component (**nav**) will now hold our `<router-outlet></router-outlet>` and our *app.component.html* file will hold our `<app-nav></app-nav>`

4. We can now push our code to github to publish our new branch.
   ```bash
   git push -uf origin main
	```

### Setting up Github Actions to deploy to AWS S3 Bucket

1. We head over to our github repository and navigate to the Actions tab and setup the workflow below. Some parameters need to be changed.
   Link to youtube page explaining the script below -> [[https://www.youtube.com/watch?v=68bDxcf1SGI]]
```yml
   # This is a basic workflow to help you get started with Actions

name: Deploy to AWS S3

# Controls when the action will run. Triggers the workflow on push or pull request
# events but only for the master branch
on:
  push:
    branches: [ <input the branch you want to watch> ]
  pull_request:
    branches: [ <input the branch you want to watch> ]

# A workflow run is made up of one or more jobs that can run sequentially or in parallel
jobs:
  # This workflow contains a single job called "build"
  build_and_deploy:
    # The type of runner that the job will run on
    runs-on: ubuntu-latest
    # Here we are configuring build matrix that allows you to perform certain operations on your code
    # with different software/Operating system configurations.
    # In our case, we are only running it for Node v12.*. but you can multiple entries in that array.
      

    # Steps represent a sequence of tasks that will be executed as part of the job
    steps:
      # Checks-out your repository under $GITHUB_WORKSPACE, so your job can access it
      # As you can see below we are using matrix.node-version => it means it will execute for all possible combinations
      # provided matrix keys array(in our case only one key => node-version)
      - uses: actions/checkout@v3
      - name: Use Node.js env
        uses: actions/setup-node@v3.4.1

      # Install the node modules
      - name: NPM Install
        run: npm install

      # Create production build
      - name: Production Build
        run: npm run build --prod # This is equivalent to 'ng build --prod'
        
      # Deploy to S3
      # This is a third party action used to sync our production build app with the AWS S3 bucket
      # For security purpose I am using secrets configured in project repo setting.
      - name: Deploy to S3
        uses: jakejarvis/s3-sync-action@v0.5.1
        with:
          # --acl public read => makes files publicly readable(i.e. makes sure that your bucket settings are also set to public)
          # --delete => permanently deletes files in S3 bucket that are not present in latest build
          args: --acl public-read --delete
        env:
          AWS_S3_BUCKET: '<input the name of your AWS S3 Bucket>'
          # note: use IAM role with limited role for below access-key-id and secret-access-key
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }} # Access Key ID
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }} # Access Secret Key
          SOURCE_DIR: "<input the name of the build folder>" # build folder
```
	- We need to add the secrets to our Credentials section under Settings on our Github Repository.
	- We also need to add our *index.html* as an error page to allow our website to redirect to allour pages.

### Setting up firebase for authentication
1. We first install the Firebase module
   ```bash
   npm install firebase
	```

2. We now need to add our Authentication functionality in an Angular service. Begin by creating a new service and input functionality for authenticating with Firebase.
   ```bash
   ng generate service auth
	```

```ts
import { Injectable } from '@angular/core';
import 'firebase/compat/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  emailVerified: boolean;
}

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  userData: any;

  constructor(private router: Router, private snackBar: MatSnackBar) {
    firebase.initializeApp(environment.firebase);
  }
  
  async SignIn(email: string, password: string) {
    try {
      let loginAction = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);

      this.router.navigate(['/users']);

      this.snackBar.open('Login Success', 'Success', {
        duration: 2 * 1000,
      });

      localStorage.setItem('userId', loginAction.user?.uid!);
      localStorage.setItem('token', loginAction.user?.refreshToken!);
      localStorage.setItem(
        'userData',
        JSON.stringify(loginAction.user?.providerData[0])
      );

      this.userData = loginAction.user;
    } catch (error) {
      this.snackBar.open('Login Failure/Invalid credentials', 'Failure', {
        duration: 2 * 1000,
      });
    }
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('userData')!);
    return user !== null ? true : false;
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/landing']);
  }
}
```
- In our constructor, we use dependancy injection to add two modules. We then initialize our firebase application with the configurations saved in the environment file.
- In our `SignIn` function, we declare a variable that will store our firebase response. The auth method for firebase has a `signInWithEmailAndPassword` function that allows us to sign in using an email and password.
- If authentication succeds, the try-catch exception won't be triggered. We save the user details to the localStorage and navigate him/her to the User's page.
- We also have an `isLoggedIn` function that will be used by our Auth-Guard to check if the user has logged in. It returns a boolean.
- We then define a `logout` function that will clear our localStorage.

3. We now create an Angular Auth-Guard that will protect certain pages from being accessed if the user is not logged in.
   ```bash
   ng generate guard fire-auth
	```

```ts
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
  
@Injectable({
  providedIn: 'root',
})
export class FireAuthGuard implements CanActivate {
  constructor(
    public authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.authService.isLoggedIn !== true) {
      this.router.navigate(['landing']);
      this.snackBar.open(
        'You are not authorized to view this page',
        'Auth Error',
        { duration: 2 * 1000 }
      );
    }
    return true;
  }
}
```
- We simply define a `canActivate` function that call the `isLoggedIn` function defined in our auth service.

4. We finally add the guard to the components we want protected. In our case we want to protect our Users component.
```ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { LoginComponent } from './components/login/login.component';
import { FireAuthGuard } from './guards/fire-auth.guard';
import { UsersComponent } from './components/users/users.component';

const routes: Routes = [
  { path: 'landing', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'users', component: UsersComponent, canActivate: [FireAuthGuard] },
  { path: '**', pathMatch: 'full', component: LandingComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
```


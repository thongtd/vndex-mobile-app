package com.xwallet;
import cl.json.RNSharePackage;
import cl.json.ShareApplication;

import android.app.Application;
import android.content.Context;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import java.lang.reflect.InvocationTargetException;
import java.util.Arrays;
import java.util.List;
import com.reactnativenavigation.NavigationApplication;
import com.reactnativenavigation.react.NavigationReactNativeHost;
import com.reactnativenavigation.react.ReactGateway;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.BV.LinearGradient.LinearGradientPackage; // <--- This!
import com.bebnev.RNUserAgentPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.ocetnik.timer.BackgroundTimerPackage; 
import com.dylanvann.fastimage.FastImageViewPackage;
import com.horcrux.svg.SvgPackage;
import com.imagepicker.ImagePickerPackage;
import fr.bamlab.rnimageresizer.ImageResizerPackage;
import org.reactnative.camera.RNCameraPackage;
import com.reactnativecommunity.rnpermissions.RNPermissionsPackage;
public class MainApplication extends NavigationApplication {

    @Override
    protected ReactGateway createReactGateway() {
        ReactNativeHost host = new NavigationReactNativeHost(this, isDebug(), createAdditionalReactPackages()) {
            @Override
            protected String getJSMainModuleName() {
                return "index";
            }
        };
        return new ReactGateway(this, isDebug(), host);
    }

    @Override
    public boolean isDebug() {
        return BuildConfig.DEBUG;
    }

    protected List<ReactPackage> getPackages() {
        // Add additional packages you require here
        // No need to add RnnPackage and MainReactPackage
        return Arrays.<ReactPackage>asList(
          new RNI18nPackage(),
          new AsyncStoragePackage(),
          new LinearGradientPackage(),
          new RNUserAgentPackage(),
          new RNDeviceInfo(),
          new BackgroundTimerPackage(),
          new FastImageViewPackage(),
          new SvgPackage(),
          new RNSharePackage(),
          new ImagePickerPackage(),
          new ImageResizerPackage(),
          new RNCameraPackage(),
          new RNPermissionsPackage()
            // eg. new VectorIconsPackage()
        );
    }

    @Override
    public List<ReactPackage> createAdditionalReactPackages() {
        return getPackages();
    }
}
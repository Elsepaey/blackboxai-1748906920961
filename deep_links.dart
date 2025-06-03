import 'dart:async';
import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_branch_sdk/flutter_branch_sdk.dart';
import 'package:dio/dio.dart';
import 'package:get/get.dart';
import 'package:get/get_core/src/get_main.dart';

import '../../pages/shared_file/shared_file.dart';

class BranchService {
  static StreamSubscription<Map>? _streamSubscription;
  static final Dio _dio = Dio();

  // Callback for navigation - set this in your main app
  static Function(String fileId, Map<String, dynamic> fileData)? onFileReceived;
  static Function(String error)? onError;

  // Loading state management
  static final RxBool _isLoading = false.obs;
  static RxBool get isLoading => _isLoading;

  static Future<void> initBranch() async {
    // Initialize Branch SDK
    await FlutterBranchSdk.init();

    // Listen for incoming links - this should be called after init
    _streamSubscription = FlutterBranchSdk.listSession().listen((data) {
      print('Branch session data: $data');

      // Check if this is a Branch link click
      if (data.containsKey('+clicked_branch_link') &&
          data['+clicked_branch_link'] == true) {
        // Handle deep link data
        handleDeepLink(data);
      } else {
        // Handle organic app open or other scenarios
        print('App opened organically or non-Branch link');
      }
    }, onError: (error) {
      print('Branch session error: $error');
    });
  }

  static void handleDeepLink(Map data) async {
    print('Handling deep link with data: $data');

    // Extract file_id from Branch data (this matches your backend structure)
    String? fileId = data['file_id'];
    String? sharedBy = data['shared_by'];
    String? deepLinkPath = data['\$deeplink_path'];

    // Extract other Branch parameters
    String? channel = data['~channel'];
    String? feature = data['~feature'];
    String? campaign = data['~campaign'];

    print('File ID: $fileId');
    print('Shared By: $sharedBy');
    print('Deep Link Path: $deepLinkPath');
    print('Channel: $channel');
    print('Feature: $feature');
    print('Campaign: $campaign');

    // If file_id exists in the deep link data, call the API
    if (fileId != null && fileId.isNotEmpty) {
      await getSharedFile(fileId);
    } else if (deepLinkPath != null && deepLinkPath.startsWith('shared/')) {
      // Extract file ID from deeplink path: "shared/{fileId}"
      String extractedFileId = deepLinkPath.substring(7); // Remove "shared/" prefix
      if (extractedFileId.isNotEmpty) {
        await getSharedFile(extractedFileId);
      }
    } else {
      print('No file_id found in deep link data');
    }
  }

  // Extract file ID from URL path (for your specific deep link format)
  static String? extractFileIdFromUrl(String url) {
    try {
      Uri uri = Uri.parse(url);
      List<String> pathSegments = uri.pathSegments;

      // Check if there's a file_id parameter in the URL
      if (uri.queryParameters.containsKey('file_id')) {
        return uri.queryParameters['file_id'];
      }

      // If file ID is the last path segment (adjust as needed)
      if (pathSegments.isNotEmpty) {
        String lastSegment = pathSegments.last;
        // Validate if it looks like a file ID (you might want to add validation)
        if (lastSegment.length > 10) { // Basic validation
          return lastSegment;
        }
      }

      return null;
    } catch (e) {
      print('Error extracting file ID from URL: $e');
      return null;
    }
  }

  // Show loading dialog
  static void _showLoadingDialog() {
    if (Get.isDialogOpen == true) return; // Prevent multiple dialogs

    Get.dialog(
      WillPopScope(
        onWillPop: () async => false, // Prevent dismissing by back button
        child: Dialog(
          backgroundColor: Colors.transparent,
          elevation: 0,
          child: Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(10),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const CircularProgressIndicator(
                  valueColor: AlwaysStoppedAnimation<Color>(Colors.blue),
                ),
                const SizedBox(height: 16),
                const Text(
                  'opening shared file...',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
      barrierDismissible: false,
    );
  }

  // Hide loading dialog
  static void _hideLoadingDialog() {
    if (Get.isDialogOpen == true) {
      Get.back();
    }
  }

  // API call to get shared file with loading indicator
  static Future<void> getSharedFile(String fileId) async {
    try {
      print('Calling API for file ID: $fileId');

      // Show loading indicator
      _isLoading.value = true;
      _showLoadingDialog();

      var response = await _dio.request(
        'https://yalaa-production.up.railway.app/auth/getSharedFile/$fileId',
        options: Options(
          method: 'GET',

          receiveTimeout: const Duration(seconds: 30),
        ),
      );

      if (response.statusCode == 200) {
        print('API Response: ${json.encode(response.data)}');

        // Handle the successful response here
        await handleFileResponse(response.data, fileId);

        // Hide loading and navigate to the file viewer screen
        _hideLoadingDialog();
        _isLoading.value = false;

        _navigateToFileViewer(fileId, response.data);

        // Call the navigation callback if set
        if (onFileReceived != null) {
          onFileReceived!(fileId, response.data);
        }

      } else {
        _hideLoadingDialog();
        _isLoading.value = false;

        print('API Error: ${response.statusMessage}');

        // Show error dialog
        _showErrorDialog('Failed to load file: ${response.statusMessage}');

        if (onError != null) {
          onError!('Failed to load file: ${response.statusMessage}');
        }
      }
    } catch (e) {
      _hideLoadingDialog();
      _isLoading.value = false;

      print('Error calling getSharedFile API: $e');

      // Show error dialog
      String errorMessage = 'Network error occurred';
      if (e is DioException) {
        if (e.type == DioExceptionType.connectionTimeout) {
          errorMessage = 'Connection timeout - please check your internet connection';
        } else if (e.type == DioExceptionType.receiveTimeout) {
          errorMessage = 'Request timeout - please try again';
        } else if (e.response?.statusCode == 404) {
          errorMessage = 'File not found or has expired';
        } else {
          errorMessage = 'Failed to load file - please try again';
        }
      }

      _showErrorDialog(errorMessage);

      if (onError != null) {
        onError!(errorMessage);
      }
    }
  }

  // Show error dialog
  static void _showErrorDialog(String message) {
    Get.dialog(
      AlertDialog(
        title: const Text('Error'),
        content: Text(message),
        actions: [
          TextButton(
            onPressed: () => Get.back(),
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }

  // Handle the file response - customize based on your needs
  static Future<void> handleFileResponse(dynamic responseData, String fileId) async {
    try {
      // Parse and handle the file data
      print('Processing file data for file ID: $fileId');

      // Based on your API structure, handle the file response
      if (responseData is Map<String, dynamic>) {
        // Extract file information from your API response
        String? fileName = responseData['fileName'] ?? responseData['name'];
        String? fileUrl = responseData['fileUrl'] ?? responseData['url'];
        String? fileType = responseData['fileType'] ?? responseData['type'];
        String? fileSize = responseData['fileSize']?.toString() ?? responseData['size']?.toString();
        String? uploadDate = responseData['uploadDate'] ?? responseData['createdAt'];

        print('File Name: $fileName');
        print('File URL: $fileUrl');
        print('File Type: $fileType');
        print('File Size: $fileSize');
        print('Upload Date: $uploadDate');

        // Track that user opened a shared file
        await trackEvent('shared_file_opened', {
          'file_id': fileId,
          'file_name': fileName ?? 'Unknown',
          'file_type': fileType ?? 'Unknown',
        });
      }

    } catch (e) {
      print('Error handling file response: $e');
    }
  }

  // Navigate to file viewer screen
  static void _navigateToFileViewer(String fileId, Map<String, dynamic> fileData) {
    try {
      // Option 1: Using GetX (if you're using GetX)
      if (Get.isRegistered<GetxController>() || Get.currentRoute != null) {
        Get.to(() => SharedFileViewerScreen(
          fileId: fileId,
          fileData: fileData,
        ));
        return;
      }

      // Option 2: Using Navigator without context (requires proper setup)
      Navigator.of(Get.context!).push(
        MaterialPageRoute(
          builder: (context) => SharedFileViewerScreen(
            fileId: fileId,
            fileData: fileData,
          ),
        ),
      );

    } catch (e) {
      print('Error navigating to file viewer: $e');
      if (onError != null) {
        onError!('Failed to open file viewer');
      }
    }
  }

  static Future<BranchContentMetaData> createContentMetadata() async {
    BranchContentMetaData contentMetaData = BranchContentMetaData();

    // Add custom metadata
    contentMetaData.addCustomMetadata('custom_key', 'custom_value');
    contentMetaData.addCustomMetadata('product_id', '123');

    // Set content schema
    contentMetaData.contentSchema = BranchContentSchema.COMMERCE_PRODUCT;

    // Set price and currency
    contentMetaData.price = 50.99;
    contentMetaData.currencyType = BranchCurrencyType.USD;
    contentMetaData.quantity = 1;

    // Additional metadata you might want to set
    contentMetaData.productName = 'Sample Product';
    contentMetaData.productBrand = 'Sample Brand';
    contentMetaData.productCategory = BranchProductCategory.ELECTRONICS;
    contentMetaData.condition = BranchCondition.NEW;

    return contentMetaData;
  }

  // Create Branch link with file_id parameter
  static Future<String> createBranchLinkForFile(String fileId) async {
    try {
      // Create Branch Universal Object
      BranchUniversalObject buo = BranchUniversalObject(
        canonicalIdentifier: 'file/$fileId',
        title: 'Shared File',
        contentDescription: 'Shared file link',
        imageUrl: 'https://example.com/file-icon.jpg',
        contentMetadata: BranchContentMetaData(),
        keywords: ['file', 'sharing', 'document'],
        publiclyIndex: true,
        locallyIndex: true,
      );

      // Create Link Properties
      BranchLinkProperties lp = BranchLinkProperties(
        channel: 'file_sharing',
        feature: 'file_link',
        campaign: 'file_sharing_campaign',
        stage: 'shared',
        tags: ['file', 'shared'],
      );

      // Add custom control parameters that will be passed in deep link data
      lp.addControlParam('file_id', fileId);
      lp.addControlParam('action', 'open_file');

      // Generate short URL
      BranchResponse response = await FlutterBranchSdk.getShortUrl(
        buo: buo,
        linkProperties: lp,
      );

      if (response.success) {
        print('Branch file link created successfully: ${response.result}');
        return response.result;
      } else {
        print('Failed to create Branch file link: ${response.errorMessage}');
        throw Exception('Failed to create Branch file link: ${response.errorMessage}');
      }
    } catch (e) {
      print('Error creating Branch file link: $e');
      throw Exception('Failed to create Branch file link: $e');
    }
  }

  static Future<String> createBranchLink() async {
    try {
      // Create Branch Universal Object
      BranchUniversalObject buo = BranchUniversalObject(
        canonicalIdentifier: 'product/123',
        title: 'Product Title',
        contentDescription: 'Product Description',
        imageUrl: 'https://example.com/image.jpg',
        contentMetadata: await createContentMetadata(),
        keywords: ['product', 'electronics', 'sale'],
        publiclyIndex: true,
        locallyIndex: true,
      );

      // Create Link Properties
      BranchLinkProperties lp = BranchLinkProperties(
        channel: 'social',
        feature: 'sharing',
        campaign: 'summer_sale',
        stage: 'new user',
        tags: ['product', 'summer'],
      );

      // Add custom control parameters that will be passed in deep link data
      lp.addControlParam('custom_data', 'custom_value');
      lp.addControlParam('product_id', '123');

      // Generate short URL
      BranchResponse response = await FlutterBranchSdk.getShortUrl(
        buo: buo,
        linkProperties: lp,
      );

      if (response.success) {
        print('Branch link created successfully: ${response.result}');
        return response.result;
      } else {
        print('Failed to create Branch link: ${response.errorMessage}');
        throw Exception('Failed to create Branch link: ${response.errorMessage}');
      }
    } catch (e) {
      print('Error creating Branch link: $e');
      throw Exception('Failed to create Branch link: $e');
    }
  }

  static Future<void> trackEvent(String eventName, Map<String, dynamic> eventData) async {
    try {
      // Create custom event
      BranchEvent branchEvent = BranchEvent.customEvent(eventName);

      // Add custom data to the event
      eventData.forEach((key, value) {
        branchEvent.addCustomData(key, value.toString());
      });

      // You can also set standard commerce data if applicable
      branchEvent.transactionID = 'transaction_123';
      branchEvent.currency = BranchCurrencyType.USD;
      branchEvent.revenue = 50.99;

      // Create BUO for the event if needed
      BranchUniversalObject buo = BranchUniversalObject(
        canonicalIdentifier: 'event/tracking',
        title: 'Event Tracking',
        contentDescription: 'Tracking user events',
        contentMetadata: BranchContentMetaData(),
      );

      // Track the event
      FlutterBranchSdk.trackContent(buo: [buo], branchEvent: branchEvent);
      print('Event tracked successfully: $eventName');
    } catch (e) {
      print('Error tracking event: $e');
    }
  }

  // Additional utility methods that match Android functionality
  static Future<void> trackStandardEvent(BranchStandardEvent standardEvent,
      {BranchUniversalObject? buo, Map<String, dynamic>? customData}) async {
    try {
      BranchEvent branchEvent = BranchEvent.standardEvent(standardEvent);

      if (customData != null) {
        customData.forEach((key, value) {
          branchEvent.addCustomData(key, value.toString());
        });
      }

      List<BranchUniversalObject> buoList = [];
      if (buo != null) {
        buoList.add(buo);
      }

      FlutterBranchSdk.trackContent(buo: buoList, branchEvent: branchEvent);
      print('Standard event tracked: $standardEvent');
    } catch (e) {
      print('Error tracking standard event: $e');
    }
  }

  // Clean up resources
  static void dispose() {
    _streamSubscription?.cancel();
    _streamSubscription = null;
  }
}
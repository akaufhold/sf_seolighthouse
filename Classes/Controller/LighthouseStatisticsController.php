<?php
//declare(strict_types=1);

namespace Stackfactory\SfSeolighthouse\Controller;

use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Core\Context\Context; 

use Stackfactory\SfSeolighthouse\Domain\Model\LighthouseStatistics;
use Stackfactory\SfSeolighthouse\Domain\Repository\LighthouseStatisticsRepository;
use Stackfactory\SfSeolighthouse\Domain\Repository\LogEntryLighthouseRepository;

use TYPO3\CMS\Belog\Domain\Repository\LogEntryRepository;
use TYPO3\CMS\Belog\Domain\BackendLog;
use TYPO3\CMS\Backend\Utility\BackendUtility;
use TYPO3\CMS\Core\Utility\DebugUtility;
use TYPO3\CMS\Core\Site\Entity\Site;
use TYPO3\CMS\Core\Site\Entity\SiteLanguage;
use TYPO3\CMS\Core\Page\PageRenderer;
use TYPO3\CMS\Core\Site\SiteFinder;
use TYPO3\CMS\Core\SysLog\Action\Database;
use TYPO3\CMS\Beuser;

/**
 *
 * This file is part of the "SEO Lighthouse Score" Extension for TYPO3 CMS.
 *
 * For the full copyright and license information, please read the
 * LICENSE.txt file that was distributed with this source code.
 *
 * (c) 2021 Andreas Kauhold <info@stackfactory.de>, Stackfactory
 */

/**
 * LighthouseStatisticsController
 */
class LighthouseStatisticsController extends \TYPO3\CMS\Extbase\Mvc\Controller\ActionController
{
    public function __construct(){
        $this->pageSpeedApiUrl = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?";
    }
    /**
     * lighthouseStatisticsRepository
     * 
     * @var LighthouseStatisticsRepository
     */
    protected $lighthouseStatisticsRepository = null;

    /**
     * @param LighthouseStatisticsRepository $lighthouseStatisticsRepository
     */
    public function injectLighthouseStatisticsRepository(LighthouseStatisticsRepository $lighthouseStatisticsRepository)
    {
        $this->lighthouseStatisticsRepository = $lighthouseStatisticsRepository;
    }
    
    /**
     * @var LogEntryLighthouseRepository
     */
    protected $logEntryLighthouseRepository;

    /**
     * @param LogEntryLighthouseRepository $logEntryLighthouseRepository
     */
    public function injectLogEntryLighthouseRepository(LogEntryLighthouseRepository $logEntryLighthouseRepository)
    {
        $this->logEntryLighthouseRepository = $logEntryLighthouseRepository;
    }

    /**
     * get be-user language id
     * 
     * @return string
     */
    public static function getBeUserLang(){
        return ($GLOBALS['BE_USER']->uc['lang'] == '') ? 'en' : $GLOBALS['BE_USER']->uc['lang'];
    }

    /**
     * get language id
     * 
     * @return int
     */
    public function getLangId(){
        $context = GeneralUtility::makeInstance(Context::class);
        /** @var TYPO3\CMS\Core\Site\Entity\Site */
        $langId = $context->getPropertyFromAspect('language', 'id');
        return $langId;
    }

    /**
     * get language iso code
     * 
     * @return string
     */
    public function getLocale(){
        /** @var TYPO3\CMS\Core\Site\Entity\Site */
        $site = $GLOBALS['TYPO3_REQUEST']->getAttribute('site');
        /** @var TYPO3\CMS\Core\Site\Entity\SiteLanguage */
        $langId = $this->getLangId();
        $language = $site->getLanguageById($langId);
        $langCode = $language->getLocale();
        if (str_contains($langCode,".")){
            $langCode = explode(".",$langCode)[0];
        }
        return $langCode;
    }

    /**
     * selected page id
     * 
     * @return int
     */
    public function getSelectedPage(){
        $selectedPage = GeneralUtility::_GP('id');
        if (!$selectedPage)
            $selectedPage = $GLOBALS['TSFE']->id;
        return $selectedPage;
    }

    /**
     * storage pid
     * 
     * @return int
     */
    public function getStoragePid(){
        $configurationManager = GeneralUtility::makeInstance('TYPO3\\CMS\\Extbase\\Configuration\\BackendConfigurationManager');
        $configurationManager->getDefaultBackendStoragePid(); 
        $extbaseFrameworkConfiguration = $configurationManager->getTypoScriptSetup();
        $storagePid = $extbaseFrameworkConfiguration["module."]["tx_sfseolighthouse."]["persistence."]["storagePid"];
        return $storagePid;
    }

    /**
     * Prepend current url if url is relative
     *
     * @param string $url given url
     * @return string
     */
    public static function prependDomain(string $url): string
    {
        if (!str_starts_with($url, GeneralUtility::getIndpEnv('TYPO3_SITE_URL'))) {
            $url = GeneralUtility::getIndpEnv('TYPO3_SITE_URL') . $url;
        }

        return $url;
    }

    /**
     * lighthouse target page url
     * 
     * @return string
     */
    public function getTargetUrl($locale, $pageurl, $device){
        $this->targetUrl = $this->pageSpeedApiUrl."locale=".$locale."&url=".$pageurl;
        if ($device)
            $this->targetUrl.="&strategy=".$device;
        return $this->targetUrl;
    }
    
    /**
     * action analyse
     * 
     * @return string|object|null|void
     */
    public function analyseAction()
    {
        $lighthouseStatistics = $this->lighthouseStatisticsRepository->findAll();
        $storagePid = $this->getStoragePid();

        $lang = $this->getBeUserLang();
        $lightHouseGetUrl   = $this->prependDomain("index.php?id=".$this->getSelectedPage());
        $lightHouseGetUrl   = "https://www.stackfactory.de";

        $ajaxGetUrlDesktop  = $this->getTargetUrl($lang,$lightHouseGetUrl,"desktop");
        $ajaxGetUrlMobile  = $this->getTargetUrl($lang,$lightHouseGetUrl,"mobile");
        
        //$this->view->assign('lighthouseStatistics', $lighthouseStatistics); 

        if ($this->request->hasArgument('uid')) {
            $uid = $this->request->getArgument('uid');
            $lighthouseStatisticsForUid = $this->lighthouseStatisticsRepository->findByUids($uid);
            $this->view->assign('lighthouseStatistics', $lighthouseStatisticsForUid); 
            $lighthouseStatisticsAudit  = $lighthouseStatisticsForUid->getFirst()->getAudit();
            $this->view->assign('audit', $lighthouseStatisticsAudit);
        }
        
        $this->view->assign('pageId', $this->getSelectedPage());
        if (($this->request->hasArgument('targetpid')) && (!$this->getSelectedPage())) {
            $this->view->assign('pageId', $this->request->hasArgument('targetpid'));
        }
        //DebugUtility::debug($this->request->hasArgument('targetpid'));
        

        $this->view->assign('storagePid', $storagePid);
        $this->view->assign('ajaxGetUrlDesktop', $ajaxGetUrlDesktop);
        $this->view->assign('ajaxGetUrlMobile', $ajaxGetUrlMobile);
    }

    /**
     * action list
     * 
     * @return string|object|null|void
     */
    public function listAction()
    {
        $lighthouseStatistics = $this->lighthouseStatisticsRepository->findLimitedEntries(20, $this->getSelectedPage());
        $pageId     = $this->getSelectedPage();
        //$slug       = BackendUtility::getPreviewUrl($pageId);
        //DebugUtility::debug($slug);
        //DebugUtility::debug($this->prependDomain("index.php?id=12"));
        
        $this->view->assign('lighthouseStatistics', $lighthouseStatistics); 
        $this->view->assign('pageId', $pageId); 
    }

    /**
     * action show
     * 
     * @param LighthouseStatistics $lighthouseStatistics
     * @return string|object|null|void
     */
    public function showAction(LighthouseStatistics $lighthouseStatistics)
    {
        $this->view->assign('lighthouseStatistics', $lighthouseStatistics);
    }

    /**
     * action delete
     * 
     * @param LighthouseStatistics $lighthouseStatistics
     * @return string|object|null|void
     */
    public function deleteAction(LighthouseStatistics $lighthouseStatistics)
    {
        if ($GLOBALS['BE_USER']->isAdmin()){
            $this->lighthouseStatisticsRepository->remove($lighthouseStatistics);
            $this->redirect('list');
        }else{
            $this->addFlashMessage('The object was not deleted. Please Login as User with administration rights.', '', \TYPO3\CMS\Core\Messaging\AbstractMessage::WARNING);
        }
    }

    /**
     * action new
     * 
     * @return string|object|null|void
     */
    public function newAction()
    {
    }

    /**
     * action create
     * 
     * @param $newLighthouseStatistics
     * @return string|object|null|void
     */
    public function createAction(LighthouseStatistics $newLighthouseStatistics)
    {
        if ($GLOBALS['BE_USER']->isAdmin()){
            $this->lighthouseStatisticsRepository->add($newLighthouseStatistics);
            DebugUtility::debug($newLighthouseStatistics);
            $this->redirect('list');
        }else{
            $this->addFlashMessage('The object was not created. Please Login as User with administration rights.', '', \TYPO3\CMS\Core\Messaging\AbstractMessage::WARNING);
        }
    }
    
}
